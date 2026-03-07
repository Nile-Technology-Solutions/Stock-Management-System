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
 * Deducts stock materials atomically and creates material usage rows.
 * If linked to an order (orderId), auto-updates order status.
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
        orderId,
        materialUsages = [],
    } = data;

    const parsedCategoryId = parseInt(categoryId, 10);
    if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
        const err = new Error('categoryId must be a positive integer');
        err.statusCode = 400;
        throw err;
    }

    const parsedOrderId = orderId ? parseInt(orderId, 10) : null;
    const normalizedMaterialUsages = Array.isArray(materialUsages) ? materialUsages : [];
    const usageTotals = normalizedMaterialUsages.reduce((acc, usage) => {
        const stockMaterialId = parseInt(usage.stockMaterialId, 10);
        const quantityUsed = parseInt(usage.quantityUsed, 10);

        if (!Number.isInteger(stockMaterialId) || stockMaterialId <= 0 || !Number.isInteger(quantityUsed) || quantityUsed <= 0) {
            const err = new Error('materialUsages must contain valid stockMaterialId and quantityUsed values');
            err.statusCode = 400;
            throw err;
        }

        acc.set(stockMaterialId, (acc.get(stockMaterialId) || 0) + quantityUsed);
        return acc;
    }, new Map());

    return prisma.$transaction(async (tx) => {
        if (parsedOrderId) {
            const order = await tx.order.findUnique({ where: { id: parsedOrderId } });
            if (!order) {
                const err = new Error('Linked order not found');
                err.statusCode = 404;
                throw err;
            }
        }

        // Deduct stock at production creation to keep inventory in sync.
        for (const [stockMaterialId, quantityUsed] of usageTotals.entries()) {
            const material = await tx.stockMaterial.findUnique({ where: { id: stockMaterialId } });
            if (!material) {
                const err = new Error(`Stock material (ID: ${stockMaterialId}) not found`);
                err.statusCode = 404;
                throw err;
            }
            if (material.quantity < quantityUsed) {
                const err = new Error(
                    `Insufficient stock for "${material.name}". Available: ${material.quantity}, required: ${quantityUsed}`
                );
                err.statusCode = 400;
                throw err;
            }
            await tx.stockMaterial.update({
                where: { id: stockMaterialId },
                data: { quantity: { decrement: quantityUsed } },
            });
        }

        const record = await tx.productionRecord.create({
            data: {
                categoryId: parsedCategoryId,
                title,
                status,
                progressPercentage,
                startedDate: startedDate ? new Date(startedDate) : new Date(),
                submittingDate: submittingDate ? new Date(submittingDate) : null,
                workInstructions,
                paymentNote,
                ...(parsedOrderId ? { orderId: parsedOrderId } : {}),
                photos: {
                    create: photos.map((url) => ({ url })),
                },
                materialUsages: {
                    create: normalizedMaterialUsages.map((usage) => ({
                        stockMaterialId: parseInt(usage.stockMaterialId, 10),
                        quantityUsed: parseInt(usage.quantityUsed, 10),
                    })),
                },
            },
            include: {
                category: true,
                photos: true,
                order: true,
                materialUsages: { include: { stockMaterial: true } },
            },
        });

        if (parsedOrderId) {
            await tx.order.update({
                where: { id: parsedOrderId },
                data: { status: status === 'Completed' ? 'Completed' : 'UnderProcess' },
            });
        }

        return record;
    });
}

/**
 * Update an existing production record.
 * If new photos are provided, they are added to the existing set.
 * If status changes to Completed and record is linked to an order, the order is updated.
 */
async function updateProduction(id, updateData) {
    const existing = await prisma.productionRecord.findUnique({
        where: { id },
        include: { order: true },
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

    // Stock deduction is handled when production is created.
    const isCompleting = fields.status === 'Completed' && existing.status !== 'Completed';

    if (isCompleting && existing.orderId) {
        return prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: { id: existing.orderId },
                data: { status: 'Completed' },
            });

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
