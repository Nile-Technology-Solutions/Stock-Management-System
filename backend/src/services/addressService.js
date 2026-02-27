const prisma = require('../config/db');

/**
 * Get all addresses for a given user.
 * @param {number} userId
 */
async function getAllAddresses(userId) {
    return prisma.address.findMany({
        where: { userId },
        orderBy: { id: 'asc' },
    });
}

/**
 * Get a single address by ID and ensure it belongs to the user.
 */
async function getAddressById(id, userId) {
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== userId) {
        const err = new Error('Address not found');
        err.statusCode = 404;
        throw err;
    }
    return address;
}

/**
 * Create a new address. If isDefault is true, clear other defaults for the user.
 */
async function createAddress(data, userId) {
    const { street, city, state = null, country = null, zipCode = null, isDefault = false } = data;

    return prisma.$transaction(async (tx) => {
        if (isDefault) {
            await tx.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        return tx.address.create({
            data: {
                userId,
                street,
                city,
                state,
                country,
                zipCode,
                isDefault,
            },
        });
    });
}

/**
 * Update an existing address. Only owner may modify.
 */
async function updateAddress(id, data, userId) {
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
        const err = new Error('Address not found');
        err.statusCode = 404;
        throw err;
    }

    const { isDefault } = data;

    return prisma.$transaction(async (tx) => {
        if (isDefault) {
            await tx.address.updateMany({
                where: { userId, isDefault: true, id: { not: id } },
                data: { isDefault: false },
            });
        }

        return tx.address.update({
            where: { id },
            data,
        });
    });
}

/**
 * Delete an address belonging to a user.
 */
async function deleteAddress(id, userId) {
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
        const err = new Error('Address not found');
        err.statusCode = 404;
        throw err;
    }

    await prisma.address.delete({ where: { id } });
    return { message: 'Address deleted' };
}

module.exports = {
    getAllAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
};
