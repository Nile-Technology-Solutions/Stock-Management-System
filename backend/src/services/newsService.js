const prisma = require('../config/db');

/**
 * Get published news for public viewing (no auth required).
 * Only returns Published posts with publishDate <= now.
 */
async function getPublishedNews() {
    return prisma.newsPost.findMany({
        where: {
            status: 'Published',
            publishDate: { lte: new Date() },
        },
        include: {
            author: { select: { id: true, fullName: true } },
            photos: true,
        },
        orderBy: { publishDate: 'desc' },
    });
}

/**
 * Get all news for admin panel with role-based visibility.
 * SuperAdmin: sees all (including others' drafts).
 * Admin: sees own posts + all published.
 */
async function getAllNews(query = {}, user) {
    const where = {};

    // Filters
    if (query.status) where.status = query.status;
    if (query.authorId) where.authorId = parseInt(query.authorId);

    // Admin can only see their own + published
    if (user.role === 'Admin' && !query.authorId) {
        where.OR = [
            { authorId: user.id },
            { status: 'Published' },
        ];
    }

    return prisma.newsPost.findMany({
        where,
        include: {
            author: { select: { id: true, fullName: true, username: true, role: true } },
            photos: true,
        },
        orderBy: { publishDate: 'desc' },
    });
}

/**
 * Get a single news post by ID.
 * @param {boolean} publicAccess - If true, only return published posts.
 * @param {object} user - Requesting user (null for public access).
 */
async function getNewsById(id, { publicAccess = false, user = null } = {}) {
    const post = await prisma.newsPost.findUnique({
        where: { id },
        include: {
            author: { select: { id: true, fullName: true, username: true, role: true } },
            photos: true,
        },
    });

    if (!post) {
        const err = new Error('News post not found');
        err.statusCode = 404;
        throw err;
    }

    // Public access: only published posts
    if (publicAccess && post.status !== 'Published') {
        const err = new Error('News post not found');
        err.statusCode = 404;
        throw err;
    }

    // Admin access: can only see own or published
    if (user && user.role === 'Admin' && post.authorId !== user.id && post.status !== 'Published') {
        const err = new Error('Access denied');
        err.statusCode = 403;
        throw err;
    }

    return post;
}

/**
 * Create a news post.
 * Admin: authorId is always set to their own ID.
 * SuperAdmin: can optionally set authorId to another user.
 */
async function createNews(data, user) {
    const {
        title,
        content,
        status = 'Published',
        publishDate = new Date(),
        photos = [],
    } = data;

    // SuperAdmin can assign authorId; Admin is always self
    let authorId = user.id;
    if (user.role === 'SuperAdmin' && data.authorId) {
        const targetUser = await prisma.user.findUnique({ where: { id: parseInt(data.authorId) } });
        if (!targetUser) {
            const err = new Error('Assigned author not found');
            err.statusCode = 404;
            throw err;
        }
        authorId = parseInt(data.authorId);
    }

    return prisma.newsPost.create({
        data: {
            title,
            content,
            status,
            publishDate: new Date(publishDate),
            authorId,
            photos: {
                create: photos.map((url) => ({ url })),
            },
        },
        include: {
            author: { select: { id: true, fullName: true, username: true, role: true } },
            photos: true,
        },
    });
}

/**
 * Update a news post.
 * Admin: can only update their own posts.
 * SuperAdmin: can update any post.
 */
async function updateNews(id, updateData, user) {
    const existing = await prisma.newsPost.findUnique({ where: { id } });
    if (!existing) {
        const err = new Error('News post not found');
        err.statusCode = 404;
        throw err;
    }

    // Admin can only update their own posts
    if (user.role === 'Admin' && existing.authorId !== user.id) {
        const err = new Error('You can only update your own posts');
        err.statusCode = 403;
        throw err;
    }

    const { photos, ...fields } = updateData;

    // Parse publishDate if provided
    if (fields.publishDate) {
        fields.publishDate = new Date(fields.publishDate);
    }
    // Parse authorId if provided (SuperAdmin only)
    if (fields.authorId !== undefined) {
        if (user.role !== 'SuperAdmin') {
            delete fields.authorId;
        } else {
            fields.authorId = parseInt(fields.authorId);
        }
    }

    return prisma.newsPost.update({
        where: { id },
        data: {
            ...fields,
            ...(photos && photos.length > 0
                ? { photos: { create: photos.map((url) => ({ url })) } }
                : {}),
        },
        include: {
            author: { select: { id: true, fullName: true, username: true, role: true } },
            photos: true,
        },
    });
}

/**
 * Delete a news post.
 * Admin: can only delete their own posts.
 * SuperAdmin: can delete any post.
 */
async function deleteNews(id, user) {
    const existing = await prisma.newsPost.findUnique({ where: { id } });
    if (!existing) {
        const err = new Error('News post not found');
        err.statusCode = 404;
        throw err;
    }

    // Admin can only delete their own posts
    if (user.role === 'Admin' && existing.authorId !== user.id) {
        const err = new Error('You can only delete your own posts');
        err.statusCode = 403;
        throw err;
    }

    await prisma.newsPost.delete({ where: { id } });
    return { message: 'News post deleted' };
}

module.exports = {
    getPublishedNews,
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
};
