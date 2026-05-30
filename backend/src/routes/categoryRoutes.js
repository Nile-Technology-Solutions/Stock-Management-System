const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireRoles } = require('../middleware/roleMiddleware');
const { ADMIN_ROLES } = require('../constans/roles');
const categoryController = require('../controllers/categoryController');

// ============ PUBLIC ROUTES ============

// GET /api/categories - Get all categories
router.get('/', categoryController.getAllCategories);

// ============ ADMIN ROUTES (Admin / Super Admin only) ============

// POST /api/categories - Create a new category
router.post('/', authMiddleware, requireRoles(ADMIN_ROLES), categoryController.createCategory);

// PUT /api/categories/:id - Update a category
router.put('/:id', authMiddleware, requireRoles(ADMIN_ROLES), categoryController.updateCategory);

// DELETE /api/categories/:id - Delete a category
router.delete('/:id', authMiddleware, requireRoles(ADMIN_ROLES), categoryController.deleteCategory);

module.exports = router;
