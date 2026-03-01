const express = require('express');
const protect = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ADMIN_ROLES, SUPER_ADMIN_ROLES } = require('../constans/roles');

const reportController = require('../controllers/reportController');

const router = express.Router();

// Apply auth middleware to all routes below
router.use(protect);

// Reports accessible by both Admin and SuperAdmin
router.get('/stock', roleMiddleware(ADMIN_ROLES), reportController.getStockReport);
router.get('/production', roleMiddleware(ADMIN_ROLES), reportController.getProductionReport);
router.get('/orders', roleMiddleware(ADMIN_ROLES), reportController.getOrdersReport);
router.get('/sales', roleMiddleware(ADMIN_ROLES), reportController.getSalesReport);

// Payments report - SuperAdmin only
router.get('/payments', roleMiddleware(SUPER_ADMIN_ROLES), reportController.getPaymentsReport);

module.exports = router;
