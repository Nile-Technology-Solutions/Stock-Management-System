const prisma = require('../config/db');

/**
 * Get all orders with optional filtering.
 * Customers see only their own orders; admins see all.
 */
async function getAllOrders(query = {}) {
    const where = {};

    if (query.userId) where.userId = parseInt(query.userId);
    if (query.status) where.status = query.status;

    return prisma.order.findMany({
        where,
        include: {
            user: { select: { id: true, fullName: true, username: true, role: true } },
            deliveryAddress: true,
            product: { include: { photos: true } },
            productionRecord: true,
            payments: true,
        },
        orderBy: { id: 'desc' },
    });
}

/**
 * Get a single order by ID with enriched relations.
 */
async function getOrderById(id) {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, fullName: true, username: true, role: true } },
            deliveryAddress: true,
            product: { include: { category: true, photos: true } },
            productionRecord: { include: { category: true, materialUsages: { include: { stockMaterial: true } }, photos: true } },
            payments: true,
        },
    });
    if (!order) {
        const err = new Error('Order not found');
        err.statusCode = 404;
        throw err;
    }
    return order;
}

/**
 * Create a new order.
 * Ready-made (productId provided): deduct FinishedProduct.stockQuantity in a transaction.
 * Custom (no productId, customNotes provided): create with status OrderSubmitted, no stock deduction.
 */
async function createOrder(data, userId) {
    const {
        productId = null,
        productName,
        quantity,
        deliveryAddressId = null,
        customNotes = null,
        totalPrice = null,
    } = data;

    const isReadyMade = productId !== null && productId !== undefined;

    if (isReadyMade) {
        // ── Ready-made order: deduct stock in a transaction ──
        return prisma.$transaction(async (tx) => {
            const product = await tx.finishedProduct.findUnique({ where: { id: parseInt(productId) } });
            if (!product) {
                const err = new Error('Product not found');
                err.statusCode = 404;
                throw err;
            }
            if (product.stockQuantity < quantity) {
                const err = new Error(`Insufficient stock. Available: ${product.stockQuantity}, requested: ${quantity}`);
                err.statusCode = 400;
                throw err;
            }

            // Deduct stock
            await tx.finishedProduct.update({
                where: { id: parseInt(productId) },
                data: { stockQuantity: { decrement: quantity } },
            });

            // Create order
            return tx.order.create({
                data: {
                    userId,
                    productId: parseInt(productId),
                    productName,
                    quantity,
                    deliveryAddressId: deliveryAddressId ? parseInt(deliveryAddressId) : null,
                    customNotes,
                    totalPrice: totalPrice ? parseFloat(totalPrice) : null,
                    status: 'OrderSubmitted',
                },
                include: {
                    user: { select: { id: true, fullName: true, username: true, role: true } },
                    deliveryAddress: true,
                    product: true,
                },
            });
        });
    } else {
        // ── Custom order: no stock deduction ──
        return prisma.order.create({
            data: {
                userId,
                productName,
                quantity,
                deliveryAddressId: deliveryAddressId ? parseInt(deliveryAddressId) : null,
                customNotes,
                totalPrice: totalPrice ? parseFloat(totalPrice) : null,
                status: 'OrderSubmitted',
            },
            include: {
                user: { select: { id: true, fullName: true, username: true, role: true } },
                deliveryAddress: true,
            },
        });
    }
}

/**
 * Update an order's status with business-rule enforcement.
 *
 * Transitions:
 *   OrderSubmitted   → PaymentConfirmed | Cancelled
 *   PaymentConfirmed → UnderProcess (auto, via production creation) | Cancelled
 *   UnderProcess     → Completed (auto, via production completion)
 *
 * Cancellation restores stock for ready-made orders.
 * Cancellation is blocked once status is UnderProcess or later.
 */
async function updateOrderStatus(id, newStatus) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
        const err = new Error('Order not found');
        err.statusCode = 404;
        throw err;
    }

    const currentStatus = order.status;

    // ── Validate status transitions ──
    const allowedTransitions = {
        OrderSubmitted: ['PaymentConfirmed', 'Cancelled'],
        PaymentConfirmed: ['Cancelled'],
        UnderProcess: [],   // Completed is set automatically by production
        Completed: [],
        Cancelled: [],
    };

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
        const err = new Error(`Cannot transition from ${currentStatus} to ${newStatus}`);
        err.statusCode = 400;
        throw err;
    }

    // ── Handle cancellation: restore stock for ready-made orders ──
    if (newStatus === 'Cancelled' && order.productId) {
        return prisma.$transaction(async (tx) => {
            await tx.finishedProduct.update({
                where: { id: order.productId },
                data: { stockQuantity: { increment: order.quantity } },
            });

            return tx.order.update({
                where: { id },
                data: { status: 'Cancelled' },
                include: {
                    user: { select: { id: true, fullName: true, username: true, role: true } },
                    deliveryAddress: true,
                    product: true,
                    productionRecord: true,
                },
            });
        });
    }

    // ── Standard status update ──
    return prisma.order.update({
        where: { id },
        data: { status: newStatus },
        include: {
            user: { select: { id: true, fullName: true, username: true, role: true } },
            deliveryAddress: true,
            product: true,
            productionRecord: true,
        },
    });
}

/**
 * Delete an order. Only allowed when status is OrderSubmitted or Cancelled.
 * If OrderSubmitted and ready-made, restore stock first.
 */
async function deleteOrder(id) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
        const err = new Error('Order not found');
        err.statusCode = 404;
        throw err;
    }

    if (!['OrderSubmitted', 'Cancelled'].includes(order.status)) {
        const err = new Error(`Cannot delete order with status ${order.status}. Only OrderSubmitted or Cancelled orders can be deleted.`);
        err.statusCode = 400;
        throw err;
    }

    // If deleting a ready-made order that hasn't been cancelled yet, restore stock
    if (order.status === 'OrderSubmitted' && order.productId) {
        return prisma.$transaction(async (tx) => {
            await tx.finishedProduct.update({
                where: { id: order.productId },
                data: { stockQuantity: { increment: order.quantity } },
            });
            await tx.order.delete({ where: { id } });
            return { message: 'Order deleted and stock restored' };
        });
    }

    await prisma.order.delete({ where: { id } });
    return { message: 'Order deleted' };
}

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    deleteOrder,
};
