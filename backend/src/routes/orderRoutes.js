const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const orderController = require('../controllers/orderController');
const { ADMIN_ROLES } = require('../constans/roles');

// GET /api/orders - Get all orders
router.get('/', authMiddleware, roleMiddleware(ADMIN_ROLES), orderController.getAllOrders);
// GET /api/orders/:id - Get single order by ID
router.get('/:id', authMiddleware, orderController.getOrderById);
// POST /api/orders - Create new order
router.post('/', authMiddleware, orderController.createOrder);
// PUT /api/orders/:id - Update order status
router.put('/:id', authMiddleware, roleMiddleware(ADMIN_ROLES), orderController.updateOrder);
// DELETE /api/orders/:id - Delete order
router.delete('/:id', authMiddleware, roleMiddleware(['SuperAdmin']), orderController.deleteOrder);

module.exports = router;
