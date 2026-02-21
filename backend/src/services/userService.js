const prisma = require('../config/db');
const { hashPassword } = require('../utils/hash');

// Fields to return (never expose password)
const USER_SELECT = {
    id: true,
    fullName: true,
    username: true,
    role: true,
    phone: true,
    addresses: true,
    createdAt: true,
    updatedAt: true,
};

/**
 * Get all users.
 */
async function getAllUsers() {
    return prisma.user.findMany({
        select: USER_SELECT,
        orderBy: { id: 'asc' },
    });
}

/**
 * Get a single user by ID.
 */
async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: USER_SELECT,
    });

    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }

    return user;
}

/**
 * Create a new user (Super Admin action).
 * Expects: { fullName, username, password, role }
 */
async function createUser(data) {
    const { fullName, username, password, role } = data;

    // Check for duplicate username
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
        const err = new Error('Username already exists');
        err.statusCode = 409;
        throw err;
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            fullName,
            username,
            password: hashedPassword,
            role,
        },
        select: USER_SELECT,
    });

    return user;
}

/**
 * Update an existing user by ID.
 * Re-hashes password if it is included in the update payload.
 */
async function updateUser(id, updateData) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }

    // If a new username is provided, check it isn't taken by another user
    if (updateData.username && updateData.username !== existing.username) {
        const duplicate = await prisma.user.findUnique({ where: { username: updateData.username } });
        if (duplicate) {
            const err = new Error('Username already exists');
            err.statusCode = 409;
            throw err;
        }
    }

    // Hash the new password if provided
    if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
    }

    const updated = await prisma.user.update({
        where: { id },
        data: updateData,
        select: USER_SELECT,
    });

    return updated;
}

/**
 * Delete a user by ID.
 * Prevents the authenticated Super Admin from deleting themselves.
 */
async function deleteUser(id, requestingUserId) {
    if (id === requestingUserId) {
        const err = new Error('You cannot delete your own account');
        err.statusCode = 400;
        throw err;
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }

    await prisma.user.delete({ where: { id } });
    return { message: 'Deleted' };
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
