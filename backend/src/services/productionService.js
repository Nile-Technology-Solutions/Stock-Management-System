const prisma = require('../config/db');

/**
 * Get all production records with optional filtering.
 */
async function getAllProduction(filter = {}) {
    return prisma.productionRecord.findMany({
        where: filter,
        orderBy: { id: 'asc' },
    });
}

/**
 * Get a single production record by ID.
 */
async function getProductionById(id) {
    const record = await prisma.productionRecord.findUnique({ where: { id } });
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
        category,
        status = 'UnderProcess',
        progressPercentage,
        startedDate,
        submittingDate = null,
        workInstructions = null,
        paymentNote = null,
        photos = [],
    } = data;

    const record = await prisma.productionRecord.create({
        data: {
            category,
            status,
            progressPercentage,
            startedDate: startedDate ? new Date(startedDate) : new Date(),
            submittingDate: submittingDate ? new Date(submittingDate) : null,
            workInstructions,
            paymentNote,
            photos,
        },
    });

    return record;
}

/**
 * Update an existing production record.
 * Merges new photos with existing ones if provided.
 */
async function updateProduction(id, updateData) {
    const existing = await prisma.productionRecord.findUnique({ where: { id } });
    if (!existing) {
        const err = new Error('Production record not found');
        err.statusCode = 404;
        throw err;
    }

    // If new photos are provided, append to existing array
    if (updateData.photos && updateData.photos.length > 0) {
        updateData.photos = [...existing.photos, ...updateData.photos];
    }

    // Parse dates if provided as strings
    if (updateData.startedDate) {
        updateData.startedDate = new Date(updateData.startedDate);
    }
    if (updateData.submittingDate) {
        updateData.submittingDate = new Date(updateData.submittingDate);
    }

    const updated = await prisma.productionRecord.update({
        where: { id },
        data: updateData,
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
