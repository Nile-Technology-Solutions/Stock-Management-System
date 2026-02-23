const prisma = require('../config/db');

/**
 * Get all production records with optional filtering.
 */
async function getAllProduction(filter = {}) {
    return prisma.productionRecord.findMany({
        where: filter,
        include: {
            order: true,
            category: true,
            materialUsages: { include: { stockMaterial: true } },
            photos: true,
        },
        orderBy: { id: 'asc' },
    });
}

/**
 * Get a single production record by ID.
 */
async function getProductionById(id) {
    const record = await prisma.productionRecord.findUnique({
        where: { id },
        include: {
            order: true,
            category: true,
            materialUsages: { include: { stockMaterial: true } },
            photos: true,
        },
    });
    if (!record) {
        const err = new Error('Production record not found');
        err.statusCode = 404;
        throw err;
    }
    return record;
}

/**
 * Create a new production record.
 * If linked to an order (orderId), auto-updates order status to UnderProcess.
 * @param {object} data - Validated body + photo paths array
 */
async function createProduction(data) {
    const {
        categoryId,
        title = null,
        status = 'UnderProcess',
        progressPercentage,
        startedDate,
        submittingDate = null,
        workInstructions = null,
        paymentNote = null,
        photos = [],
        orderId
    } = data;

    const parsedOrderId = orderId ? parseInt(orderId) : null;

    // If linked to an order, validate order exists and use a transaction
    if (parsedOrderId) {
        return prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({ where: { id: parsedOrderId } });
            if (!order) {
                const err = new Error('Linked order not found');
                err.statusCode = 404;
                throw err;
            }

            const record = await tx.productionRecord.create({
                data: {
                    categoryId: parseInt(categoryId),
                    title,
                    status,
                    progressPercentage,
                    startedDate: startedDate ? new Date(startedDate) : new Date(),
                    submittingDate: submittingDate ? new Date(submittingDate) : null,
                    workInstructions,
                    paymentNote,
                    orderId: parsedOrderId,
                    photos: {
                        create: photos.map((url) => ({ url })),
                    },
                },
                include: { category: true, photos: true },
            });

            // Auto-update order status to UnderProcess
            await tx.order.update({
                where: { id: parsedOrderId },
                data: { status: 'UnderProcess' },
            });

            return record;
        });
    }

    // Standalone production (no linked order)
    return prisma.productionRecord.create({
        data: {
            categoryId: parseInt(categoryId),
            title,
            status,
            progressPercentage,
            startedDate: startedDate ? new Date(startedDate) : new Date(),
            submittingDate: submittingDate ? new Date(submittingDate) : null,
            workInstructions,
            paymentNote,
            photos: {
                create: photos.map((url) => ({ url })),
            },
        },
        include: { category: true, photos: true },
    });
}

/**
 * Update an existing production record.
 * If new photos are provided, they are added to the existing set.
 *
 * When status changes to Completed:
 *   - Deduct StockMaterial.quantity for each ProductionMaterialUsage
 *   - If linked to an Order, update Order.status to Completed
 *   - All in a single Prisma $transaction for atomicity
 */
async function updateProduction(id, updateData) {
    const existing = await prisma.productionRecord.findUnique({
        where: { id },
        include: { materialUsages: true },
    });
    if (!existing) {
        const err = new Error('Production record not found');
        err.statusCode = 404;
        throw err;
    }

    // Extract photos from updateData to handle separately
    const { photos, ...fields } = updateData;

    // Parse dates if provided as strings
    if (fields.startedDate) {
        fields.startedDate = new Date(fields.startedDate);
    }
    if (fields.submittingDate) {
        fields.submittingDate = new Date(fields.submittingDate);
    }
    if (fields.categoryId) {
        fields.categoryId = parseInt(fields.categoryId);
    }

    // ── Completion flow: deduct materials + update linked order ──
    const isCompleting = fields.status === 'Completed' && existing.status !== 'Completed';

    if (isCompleting) {
        return prisma.$transaction(async (tx) => {
            // 1. Deduct stock materials for each usage
            for (const usage of existing.materialUsages) {
                const material = await tx.stockMaterial.findUnique({
                    where: { id: usage.stockMaterialId },
                });
                if (!material) {
                    const err = new Error(`Stock material (ID: ${usage.stockMaterialId}) not found`);
                    err.statusCode = 404;
                    throw err;
                }
                if (material.quantity < usage.quantityUsed) {
                    const err = new Error(
                        `Insufficient stock for "${material.name}". Available: ${material.quantity}, required: ${usage.quantityUsed}`
                    );
                    err.statusCode = 400;
                    throw err;
                }
                await tx.stockMaterial.update({
                    where: { id: usage.stockMaterialId },
                    data: { quantity: { decrement: usage.quantityUsed } },
                });
            }

            // 2. If linked to an order, mark it Completed
            if (existing.orderId) {
                await tx.order.update({
                    where: { id: existing.orderId },
                    data: { status: 'Completed' },
                });
            }

            // 3. Update the production record itself
            return tx.productionRecord.update({
                where: { id },
                data: {
                    ...fields,
                    ...(photos && photos.length > 0
                        ? { photos: { create: photos.map((url) => ({ url })) } }
                        : {}),
                },
                include: { category: true, photos: true, order: true, materialUsages: { include: { stockMaterial: true } } },
            });
        });
    }

    // ── Standard update (non-completion) ──
    const updated = await prisma.productionRecord.update({
        where: { id },
        data: {
            ...fields,
            ...(photos && photos.length > 0
                ? { photos: { create: photos.map((url) => ({ url })) } }
                : {}),
        },
        include: { category: true, photos: true },
    });

    return updated;
}

/**
 * Delete a production record by ID.
 */
async function deleteProduction(id) {
    const existing = await prisma.productionRecord.findUnique({ where: { id } });
    if (!existing) {
        const err = new Error('Production record not found');
        err.statusCode = 404;
        throw err;
    }

    await prisma.productionRecord.delete({ where: { id } });
    return { message: 'Deleted' };
}

module.exports = {
    getAllProduction,
    getProductionById,
    createProduction,
    updateProduction,
    deleteProduction,
};
