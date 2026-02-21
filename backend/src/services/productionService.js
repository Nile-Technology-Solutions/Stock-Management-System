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
        orderId = null,
    } = data;

    const record = await prisma.productionRecord.create({
        data: {
            categoryId: parseInt(categoryId),
            title,
            status,
            progressPercentage,
            startedDate: startedDate ? new Date(startedDate) : new Date(),
            submittingDate: submittingDate ? new Date(submittingDate) : null,
            workInstructions,
            paymentNote,
            orderId: orderId ? parseInt(orderId) : null,
            photos: {
                create: photos.map((url) => ({ url })),
            },
        },
        include: { category: true, photos: true },
    });

    return record;
}

/**
 * Update an existing production record.
 * If new photos are provided, they are added to the existing set.
 */
async function updateProduction(id, updateData) {
    const existing = await prisma.productionRecord.findUnique({ where: { id } });
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
