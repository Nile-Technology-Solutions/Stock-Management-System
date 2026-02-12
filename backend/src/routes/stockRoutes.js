const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const stockController = require('../controllers/stockController');

// GET /api/stock - Get all stock items with optional filtering
router.get('/', authMiddleware, stockController.getAllStock);

// GET /api/stock/:id - Get a single stock item by ID
router.get('/:id', authMiddleware, stockController.getStockById);

// POST /api/stock - Create a new stock item (admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), stockController.createStock);

// PUT /api/stock/:id - Update a stock item (admin only)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), stockController.updateStock);

// DELETE /api/stock/:id - Delete a stock item (admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), stockController.deleteStock);

module.exports = router;
