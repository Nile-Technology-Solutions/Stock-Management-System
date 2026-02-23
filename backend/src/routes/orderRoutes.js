const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ADMIN_ROLES } = require('../constans/roles');
const orderController = require('../controllers/orderController');
const { validateOrder, validateOrderUpdate, validateIdParam } = require('../middleware/validation');

// All order routes require authentication
router.use(authMiddleware);

// GET /api/orders - List orders (customers see only their own)
router.get('/', orderController.getAllOrders);

// GET /api/orders/:id - Get single order with enriched data
router.get('/:id', validateIdParam, orderController.getOrderById);

// POST /api/orders - Create a new order (any authenticated user)
router.post('/', validateOrder, orderController.createOrder);

// PUT /api/orders/:id - Update order status (admin/superadmin only)
router.put('/:id', validateIdParam, roleMiddleware(ADMIN_ROLES), validateOrderUpdate, orderController.updateOrderStatus);

// DELETE /api/orders/:id - Delete order (admin/superadmin only)
router.delete('/:id', validateIdParam, roleMiddleware(ADMIN_ROLES), orderController.deleteOrder);

module.exports = router;
