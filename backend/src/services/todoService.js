const prisma = require('../config/db');

/**
 * Get all todo items with optional filtering.
 * Supports: day, userId, isCompleted
 */
async function getAllTodos(query = {}) {
    const where = {};

    if (query.day) where.day = query.day;
    if (query.userId) where.userId = parseInt(query.userId);
    if (query.isCompleted !== undefined) {
        where.isCompleted = query.isCompleted === 'true' || query.isCompleted === true;
    }

    return prisma.todoItem.findMany({
        where,
        include: {
            user: { select: { id: true, fullName: true, username: true, role: true } },
        },
        orderBy: [
            { day: 'asc' },
            { id: 'asc' },
        ],
    });
}

/**
 * Get a single todo item by ID.
 */
async function getTodoById(id) {
    const todo = await prisma.todoItem.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, fullName: true, username: true, role: true } },
        },
    });
    if (!todo) {
        const err = new Error('Todo item not found');
        err.statusCode = 404;
        throw err;
    }
    return todo;
}

/**
 * Create a new todo item (SuperAdmin only).
 * @param {object} data - { day, task, userId?, isCompleted? }
 */
async function createTodo(data) {
    const { day, task, userId = null, isCompleted = false } = data;

    // Validate assigned user exists if provided
    if (userId) {
        const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
        if (!user) {
            const err = new Error('Assigned user not found');
            err.statusCode = 404;
            throw err;
        }
    }

    return prisma.todoItem.create({
        data: {
            day,
            task,
            userId: userId ? parseInt(userId) : null,
            isCompleted,
        },
        include: {
            user: { select: { id: true, fullName: true, username: true, role: true } },
        },
    });
}

/**
 * Update a todo item (SuperAdmin only — full update).
 * Can reassign, change day/task, toggle completion.
 */
async function updateTodo(id, updateData) {
    const existing = await prisma.todoItem.findUnique({ where: { id } });
    if (!existing) {
        const err = new Error('Todo item not found');
        err.statusCode = 404;
        throw err;
    }

    // Validate assigned user if being changed
    if (updateData.userId !== undefined && updateData.userId !== null) {
        const user = await prisma.user.findUnique({ where: { id: parseInt(updateData.userId) } });
        if (!user) {
            const err = new Error('Assigned user not found');
            err.statusCode = 404;
            throw err;
        }
        updateData.userId = parseInt(updateData.userId);
    }

    return prisma.todoItem.update({
        where: { id },
        data: updateData,
        include: {
            user: { select: { id: true, fullName: true, username: true, role: true } },
        },
    });
}

/**
 * Toggle completion of a todo item.
 * Admin: can only toggle their own assigned tasks.
 * SuperAdmin: can toggle anyone's.
 */
async function toggleComplete(id, requestingUser) {
    const todo = await prisma.todoItem.findUnique({ where: { id } });
    if (!todo) {
        const err = new Error('Todo item not found');
        err.statusCode = 404;
        throw err;
    }

    // Admin can only toggle tasks assigned to them
    if (requestingUser.role === 'Admin' && todo.userId !== requestingUser.id) {
        const err = new Error('You can only toggle completion on tasks assigned to you');
        err.statusCode = 403;
        throw err;
    }

    return prisma.todoItem.update({
        where: { id },
        data: { isCompleted: !todo.isCompleted },
        include: {
            user: { select: { id: true, fullName: true, username: true, role: true } },
        },
    });
}

/**
 * Delete a todo item (SuperAdmin only).
 */
async function deleteTodo(id) {
    const existing = await prisma.todoItem.findUnique({ where: { id } });
    if (!existing) {
        const err = new Error('Todo item not found');
        err.statusCode = 404;
        throw err;
    }

    await prisma.todoItem.delete({ where: { id } });
    return { message: 'Todo item deleted' };
}

module.exports = {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    toggleComplete,
    deleteTodo,
};
