const prisma = require('../config/db');

/**
 * Get all finished products with optional filtering.
 * Supports: category, featured, color, search (name/description), minPrice, maxPrice
 */
async function getAllProducts(query = {}) {
    const where = {};

    if (query.category) where.category = query.category;
    if (query.featured !== undefined) where.featured = query.featured === 'true' || query.featured === true;
    if (query.color) where.color = { contains: query.color, mode: 'insensitive' };

    // Search across description
    if (query.search) {
        where.description = { contains: query.search, mode: 'insensitive' };
    }

    // Price range filters
    if (query.minPrice || query.maxPrice) {
        where.price = {};
        if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
        if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
    }

    return prisma.finishedProduct.findMany({
        where,
        orderBy: { id: 'asc' },
    });
}

/**
 * Get a single finished product by ID.
 */
async function getProductById(id) {
    const product = await prisma.finishedProduct.findUnique({ where: { id } });
    if (!product) {
        const err = new Error('Product not found');
        err.statusCode = 404;
        throw err;
    }
    return product;
}

/**
 * Create a new finished product.
 */
async function createProduct(data) {
    const {
        category,
        photos = [],
        color,
        amount,
        price,
        description = null,
        featured = false,
    } = data;

    return prisma.finishedProduct.create({
        data: {
            category,
            photos,
            color,
            amount,
            price,
            description,
            featured,
        },
    });
}

/**
 * Update an existing finished product.
 */
async function updateProduct(id, updateData) {
    const existing = await prisma.finishedProduct.findUnique({ where: { id } });
    if (!existing) {
        const err = new Error('Product not found');
        err.statusCode = 404;
        throw err;
    }

    return prisma.finishedProduct.update({
        where: { id },
        data: updateData,
    });
}

/**
 * Delete a finished product by ID.
 */
async function deleteProduct(id) {
    const existing = await prisma.finishedProduct.findUnique({ where: { id } });
    if (!existing) {
        const err = new Error('Product not found');
        err.statusCode = 404;
        throw err;
    }

    await prisma.finishedProduct.delete({ where: { id } });
    return { message: 'Deleted' };
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
