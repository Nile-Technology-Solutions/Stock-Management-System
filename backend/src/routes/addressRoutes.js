const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const addressController = require('../controllers/addressController');

// All address routes require authentication
router.use(authMiddleware);

// GET /api/addresses - Get all addresses for current user
router.get('/', addressController.getAddresses);

// POST /api/addresses - Create a new address
router.post('/', addressController.createAddress);

// PUT /api/addresses/:id - Update an address
router.put('/:id', addressController.updateAddress);

// DELETE /api/addresses/:id - Delete an address
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
