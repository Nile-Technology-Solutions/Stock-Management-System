/**
 * Payment Controller
 * Route handlers for Chapa payment integration.
 */

const paymentService = require('../services/paymentService');

/**
 * POST /api/payments/initiate
 * Initiate a Chapa payment for an order.
 * Body: { orderId: number }
 * Auth: Required (Customer)
 */
const initiatePayment = async (req, res, next) => {
    try {
        const { orderId, paymentType = 'full' } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'orderId is required',
            });
        }

        const result = await paymentService.initiatePayment(
            parseInt(orderId),
            req.user.id,
            paymentType
        );

        return res.status(200).json({
            success: true,
            message: 'Payment initiated successfully',
            data: {
                checkoutUrl: result.checkoutUrl,
                paymentId: result.paymentId,
                txRef: result.txRef,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/payments/callback
 * Chapa callback endpoint — called by Chapa after payment.
 * Query: ?trx_ref=xxx&status=success
 * Auth: None (called by Chapa servers)
 */
const paymentCallback = async (req, res, next) => {
    try {
        const txRef = req.query.trx_ref || req.query.tx_ref;

        if (!txRef) {
            return res.status(400).json({
                success: false,
                message: 'Transaction reference is required',
            });
        }

        const result = await paymentService.handleCallback(txRef);

        return res.status(200).json({
            success: true,
            message: result.message,
            data: {
                payment: result.payment,
                order: result.order,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/payments/verify
 * Manually verify a payment (called from frontend after redirect).
 * Body: { txRef: string }
 * Auth: Required
 */
const verifyPayment = async (req, res, next) => {
    try {
        const { txRef } = req.body;

        if (!txRef) {
            return res.status(400).json({
                success: false,
                message: 'txRef is required',
            });
        }

        const result = await paymentService.handleCallback(txRef);

        return res.status(200).json({
            success: true,
            message: result.message,
            data: {
                payment: result.payment,
                order: result.order,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/payments/:orderId
 * Get payment details for an order.
 * Auth: Required
 */
const getPaymentByOrderId = async (req, res, next) => {
    try {
        const orderId = parseInt(req.params.orderId);

        if (isNaN(orderId) || orderId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID',
            });
        }

        const payments = await paymentService.getPaymentByOrderId(orderId);

        return res.status(200).json({
            success: true,
            data: { payments },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    initiatePayment,
    paymentCallback,
    verifyPayment,
    getPaymentByOrderId,
};
