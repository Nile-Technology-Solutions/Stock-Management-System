const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const { validateAddress, validateAddressUpdate, validateIdParam } = require('../middleware/validation');
const addressController = require('../controllers/addressController');

// all address endpoints require logged in user
router.use(authMiddleware);

// GET /api/addresses - list current user's addresses
router.get('/', addressController.getAllAddresses);

// GET /api/addresses/:id - get single address
router.get('/:id', validateIdParam, addressController.getAddressById);

// POST /api/addresses - create new address
router.post('/', validateAddress, addressController.createAddress);

// PUT /api/addresses/:id - update address
router.put('/:id', validateIdParam, validateAddressUpdate, addressController.updateAddress);

// DELETE /api/addresses/:id - delete address
router.delete('/:id', validateIdParam, addressController.deleteAddress);

module.exports = router;
