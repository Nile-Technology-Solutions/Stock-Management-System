const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireRoles } = require('../middleware/roleMiddleware');
const { ADMIN_ROLES } = require('../constans/roles');
const productController = require('../controllers/productController');
const { validateFinishedProduct, validateFinishedProductUpdate, validateIdParam } = require('../middleware/validation');

// ============ PUBLIC ROUTES (no auth required) ============

// GET /api/products - Get all finished products (public)
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Get finished product by ID (public)
router.get('/:id', validateIdParam, productController.getProductById);

// ============ ADMIN ROUTES (Admin / Super Admin only) ============

// POST /api/products - Create a new finished product
router.post('/', authMiddleware, requireRoles(ADMIN_ROLES), validateFinishedProduct, productController.createProduct);

// PUT /api/products/:id - Update a finished product
router.put('/:id', authMiddleware, requireRoles(ADMIN_ROLES), validateIdParam, validateFinishedProductUpdate, productController.updateProduct);

// DELETE /api/products/:id - Delete a finished product
router.delete('/:id', authMiddleware, requireRoles(ADMIN_ROLES), validateIdParam, productController.deleteProduct);

module.exports = router;
