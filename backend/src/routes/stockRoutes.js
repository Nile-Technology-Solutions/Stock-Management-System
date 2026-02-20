const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const stockController = require('../controllers/stockController');

// GET /api/stock - Get all stock items with optional filtering
router.get('/', authMiddleware, roleMiddleware(['SuperAdmin', 'Admin']), stockController.getAllStock);

// GET /api/stock/:id - Get a single stock item by ID
// Access: SuperAdmin and Admin only
router.get('/:id', authMiddleware, roleMiddleware(['SuperAdmin', 'Admin']), stockController.getStockById);

// POST /api/stock - Create a new stock item
// Access: SuperAdmin and Admin only (Admin can add stock)
router.post('/', authMiddleware, roleMiddleware(['SuperAdmin', 'Admin']), stockController.createStock);

// PUT /api/stock/:id - Update a stock item
// Access: SuperAdmin and Admin only (Admin can edit stock)
router.put('/:id', authMiddleware, roleMiddleware(['SuperAdmin', 'Admin']), stockController.updateStock);

// DELETE /api/stock/:id - Delete a stock item
// Access: SuperAdmin and Admin only (Admin can delete stock)
router.delete('/:id', authMiddleware, roleMiddleware(['SuperAdmin', 'Admin']), stockController.deleteStock);

module.exports = router;
