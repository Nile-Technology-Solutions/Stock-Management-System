const express = require('express');
const protect = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { SUPER_ADMIN_ROLES } = require('../constans/roles');

const reportController = require('../controllers/reportController');

const router = express.Router();

// Apply auth middleware to all routes below
router.use(protect);

// Apply role restriction to SuperAdmin for all report routes
router.use(roleMiddleware(SUPER_ADMIN_ROLES));

// Dynamic reporting routes
router.get('/stock', reportController.getStockReport);
router.get('/production', reportController.getProductionReport);
router.get('/orders', reportController.getOrdersReport);
router.get('/payments', reportController.getPaymentsReport);
router.get('/sales', reportController.getSalesReport);

module.exports = router;
