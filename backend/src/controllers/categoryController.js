const prisma = require('../config/db');

/**
 * Get all categories
 */
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
        return res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new category
 */
const createCategory = async (req, res, next) => {
    try {
        const { name, description, parentId } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const category = await prisma.category.create({
            data: {
                name: name.trim(),
                description: description?.trim(),
                parentId: parentId ? parseInt(parentId) : null
            }
        });

        return res.status(201).json({ data: category, message: 'Category created successfully' });
    } catch (error) {
        // Handle unique constraint violation
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Category with this name already exists' });
        }
        next(error);
    }
};

/**
 * Update an existing category
 */
const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, parentId } = req.body;

        const category = await prisma.category.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name: name.trim() }),
                ...(description !== undefined && { description: description?.trim() }),
                ...(parentId !== undefined && { parentId: parentId ? parseInt(parentId) : null })
            }
        });

        return res.status(200).json({ data: category, message: 'Category updated successfully' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Category not found' });
        }
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Category with this name already exists' });
        }
        next(error);
    }
};

/**
 * Delete a category
 */
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Before deleting, ensure it's not being used by products or stock materials
        // Prisma will naturally fail on foreign key constraints, but providing a nice message is better
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) },
            include: {
                _count: {
                    select: {
                        finishedProducts: true,
                        stockMaterials: true,
                        productionRecords: true
                    }
                }
            }
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const totalUsage = category._count.finishedProducts + category._count.stockMaterials + category._count.productionRecords;

        if (totalUsage > 0) {
            return res.status(400).json({
                error: `Cannot delete category because it is used by ${totalUsage} records. Please reassign those records first.`
            });
        }

        await prisma.category.delete({
            where: { id: parseInt(id) }
        });

        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
