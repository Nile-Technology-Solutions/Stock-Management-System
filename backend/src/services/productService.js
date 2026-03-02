const prisma = require('../config/db');

async function getAllProducts(query = {}) {
    const where = {};

    if (query.categoryId) where.categoryId = parseInt(query.categoryId);
    if (query.featured !== undefined) where.featured = query.featured === 'true' || query.featured === true;
    if (query.color) where.color = { contains: query.color, mode: 'insensitive' };

    // Search across name and description
    if (query.search) {
        where.OR = [
            { name: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
        ];
    }

    // Price range filters
    if (query.minPrice || query.maxPrice) {
        where.price = {};
        if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
        if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
    }

    return prisma.finishedProduct.findMany({
        where,
        include: { category: true, photos: true },
        orderBy: { id: 'asc' },
    });
}

/**
 * Get a single finished product by ID.
 */
async function getProductById(id) {
    const product = await prisma.finishedProduct.findUnique({
        where: { id },
        include: { category: true, photos: true },
    });
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
        name,
        categoryId,
        photos = [],
        color,
        stockQuantity,
        price,
        description = null,
        featured = false,
    } = data;

    return prisma.finishedProduct.create({
        data: {
            name,
            categoryId: parseInt(categoryId),
            color,
            stockQuantity: parseInt(stockQuantity),
            price: price ? parseFloat(price) : null,
            description,
            featured,
            photos: {
                create: photos.map((url) => ({ url })),
            },
        },
        include: { category: true, photos: true },
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

    const { photos, ...fields } = updateData;

    // Parse numeric fields if provided
    if (fields.categoryId) fields.categoryId = parseInt(fields.categoryId);
    if (fields.stockQuantity !== undefined) fields.stockQuantity = parseInt(fields.stockQuantity);
    if (fields.price !== undefined) fields.price = parseFloat(fields.price);

    return prisma.finishedProduct.update({
        where: { id },
        data: {
            ...fields,
            ...(photos && photos.length > 0
                ? { photos: { create: photos.map((url) => ({ url })) } }
                : {}),
        },
        include: { category: true, photos: true },
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
