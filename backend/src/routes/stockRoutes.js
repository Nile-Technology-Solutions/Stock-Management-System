const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireRoles } = require('../middleware/roleMiddleware');
const { ADMIN_ROLES } = require('../constans/roles');
const stockController = require('../controllers/stockController');
const { validateStock, validateStockUpdate, validateIdParam } = require('../middleware/validation');

// GET /api/stock - Get all stock items with optional filtering
router.get('/', authMiddleware, stockController.getAllStock);

// GET /api/stock/:id - Get a single stock item by ID
router.get('/:id', authMiddleware, validateIdParam, stockController.getStockById);

// POST /api/stock - Create a new stock item (Super Admin / Admin)
router.post('/', authMiddleware, requireRoles(ADMIN_ROLES), validateStock, stockController.createStock);

// PUT /api/stock/:id - Update a stock item (Super Admin / Admin)
router.put('/:id', authMiddleware, requireRoles(ADMIN_ROLES), validateIdParam, validateStockUpdate, stockController.updateStock);

// DELETE /api/stock/:id - Delete a stock item (Super Admin / Admin)
router.delete('/:id', authMiddleware, requireRoles(ADMIN_ROLES), validateIdParam, stockController.deleteStock);

module.exports = router;
