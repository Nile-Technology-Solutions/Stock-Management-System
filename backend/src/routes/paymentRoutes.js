/**
 * Payment Routes
 * Handles Chapa payment integration endpoints.
 */

const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');

// POST /api/payments/initiate — Initiate payment (authenticated)
router.post('/initiate', authMiddleware, paymentController.initiatePayment);

// GET /api/payments/callback — Chapa callback (NO auth — called by Chapa servers)
router.get('/callback', paymentController.paymentCallback);

// POST /api/payments/verify — Verify payment from frontend (authenticated)
router.post('/verify', authMiddleware, paymentController.verifyPayment);

// GET /api/payments/:orderId — Get payment details (authenticated)
router.get('/:orderId', authMiddleware, paymentController.getPaymentByOrderId);

module.exports = router;
