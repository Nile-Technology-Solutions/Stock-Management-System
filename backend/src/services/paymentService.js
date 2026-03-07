/**
 * Payment Service
 * Business logic for payment processing via Chapa gateway.
 * Handles payment initialization, callback verification, and status queries.
 */

const prisma = require('../config/db');
const chapaService = require('./chapaService');

const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Generate a unique transaction reference for Chapa.
 * Format: SMS-{orderId}-{timestamp}
 */
function generateTxRef(orderId) {
    return `SMS-${orderId}-${Date.now()}`;
}

/**
 * Initiate a Chapa payment for an order.
 *
 * 1. Validates the order belongs to the user and is in OrderSubmitted status
 * 2. Checks for existing pending payment (avoids duplicates)
 * 3. Creates a Payment record with status Pending
 * 4. Calls Chapa initialize API
 * 5. Stores transactionRef and checkoutUrl on the Payment record
 *
 * @param {number} orderId     – The order to pay for
 * @param {number} userId      – The authenticated user's ID
 * @param {string} paymentType – "deposit", "final", or "full" (default)
 * @returns {Promise<{ checkoutUrl: string, paymentId: number, txRef: string }>}
 */
async function initiatePayment(orderId, userId, paymentType = 'full') {
    // 1. Fetch the order with user details
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            user: { select: { id: true, fullName: true, email: true, phone: true } },
            payments: true,
        },
    });

    if (!order) {
        throw Object.assign(new Error('Order not found'), { statusCode: 404 });
    }

    // Verify the order belongs to the user
    if (order.userId !== userId) {
        throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    }

    // Only allow payment for orders in appropriate status
    // Deposit/full: OrderSubmitted
    // Final: Completed (production done, awaiting final payment)
    const allowedStatuses = {
        deposit: ['OrderSubmitted'],
        full: ['OrderSubmitted'],
        final: ['Completed'],
    };

    const validStatuses = allowedStatuses[paymentType] || ['OrderSubmitted'];
    if (!validStatuses.includes(order.status)) {
        throw Object.assign(
            new Error(`Cannot make ${paymentType} payment for order with status "${order.status}".`),
            { statusCode: 400 }
        );
    }

    // Check if there's already a completed payment of the same type
    const existingOfType = order.payments.find(p => p.status === 'Completed' && p.paymentType === paymentType);
    if (existingOfType) {
        throw Object.assign(
            new Error(`A ${paymentType} payment has already been completed for this order`),
            { statusCode: 400 }
        );
    }

    // Calculate amount based on payment type
    let amount;
    if (paymentType === 'deposit') {
        amount = order.depositAmount ? parseFloat(order.depositAmount) : parseFloat(order.totalPrice) * 0.5;
    } else if (paymentType === 'final') {
        const depositPaid = order.payments
            .filter(p => p.status === 'Completed' && p.paymentType === 'deposit')
            .reduce((sum, p) => sum + parseFloat(p.amount), 0);
        amount = parseFloat(order.totalPrice) - depositPaid;
    } else {
        amount = parseFloat(order.totalPrice);
    }

    if (!amount || amount <= 0) {
        throw Object.assign(
            new Error('Order does not have a valid payment amount'),
            { statusCode: 400 }
        );
    }

    // 2. Generate tx_ref
    const txRef = generateTxRef(orderId);

    // 3. Split the user's full name for Chapa
    const nameParts = (order.user.fullName || 'Customer').split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    // 4. Call Chapa initialize
    const safeEmail = (order.user.email && !order.user.email.includes('example.com'))
        ? order.user.email
        : 'customer@gmail.com';

    // Use a placeholder webhook for local testing to avoid Chapa crashing
    // Chapa's test simulator fails if it encounters a localhost webhook
    const callbackUrl = BACKEND_URL.includes('localhost')
        ? 'https://webhook.site/placeholder-for-local-testing'
        : `${BACKEND_URL}/api/payments/callback`;

    // Ensure phone number is valid for Chapa (must look like Ethiopian mobile number or Chapa UI might crash)
    let phoneNum = order.user.phone;

    // Normalize common Ethiopian formats to 09XXXXXXXX
    if (phoneNum) {
        phoneNum = phoneNum.trim();

        // Remove spaces and dashes
        phoneNum = phoneNum.replace(/[\s-]/g, '');

        // Convert +2519XXXXXXXX or 2519XXXXXXXX to 09XXXXXXXX
        if (phoneNum.startsWith('+251')) {
            phoneNum = '0' + phoneNum.slice(4);
        } else if (phoneNum.startsWith('251')) {
            phoneNum = '0' + phoneNum.slice(3);
        }
    }

    // Fallback to a safe test number if still invalid
    if (!phoneNum || phoneNum === 'unknown' || !/^09\d{8}$/.test(phoneNum)) {
        phoneNum = '0911000000';
    }

    const chapaResult = await chapaService.initializeTransaction({
        amount: parseFloat(amount),
        email: safeEmail,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNum,
        tx_ref: txRef,
        callback_url: callbackUrl,
        return_url: `${FRONTEND_URL}/payment/success?tx_ref=${txRef}&order_id=${orderId}`,
        customization: {
            title: 'Nile Tech SMS',
            description: 'Payment for order'
        }
    });

    // 5. Create payment record
    const payment = await prisma.payment.create({
        data: {
            orderId,
            amount: parseFloat(amount),
            method: 'Chapa',
            status: 'Pending',
            paymentType,
            transactionRef: txRef,
            checkoutUrl: chapaResult.checkout_url,
        },
    });

    return {
        checkoutUrl: chapaResult.checkout_url,
        paymentId: payment.id,
        txRef,
    };
}

/**
 * Handle Chapa callback / verify a payment.
 *
 * Called when Chapa sends a callback or when the user returns to the app.
 * Verifies the transaction with Chapa, then updates Payment and Order status.
 *
 * @param {string} txRef – The transaction reference to verify
 * @returns {Promise<{ payment: Object, order: Object }>}
 */
async function handleCallback(txRef) {
    if (!txRef) {
        throw Object.assign(new Error('Transaction reference is required'), { statusCode: 400 });
    }

    // Find the payment by transactionRef
    const payment = await prisma.payment.findFirst({
        where: { transactionRef: txRef },
        include: { order: true },
    });

    if (!payment) {
        throw Object.assign(new Error('Payment not found for this transaction'), { statusCode: 404 });
    }

    // Idempotent: if already completed, return current state
    if (payment.status === 'Completed') {
        return {
            payment,
            order: payment.order,
            message: 'Payment already verified',
        };
    }

    // Verify with Chapa API
    let chapaData;
    try {
        chapaData = await chapaService.verifyTransaction(txRef);
    } catch (err) {
        // Mark as failed if verification itself fails
        await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'Failed' },
        });
        throw Object.assign(
            new Error(`Payment verification failed: ${err.message}`),
            { statusCode: 502 }
        );
    }

    // Check Chapa's reported status
    const chapaStatus = chapaData.status;

    if (chapaStatus === 'success') {
        // Update payment and order in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const updatedPayment = await tx.payment.update({
                where: { id: payment.id },
                data: { status: 'Completed' },
            });

            // Determine new order status based on payment type
            let newOrderStatus;
            if (payment.paymentType === 'final') {
                newOrderStatus = 'ReadyForDelivery';
            } else if (payment.paymentType === 'deposit') {
                newOrderStatus = 'PaymentConfirmed';
            } else {
                // Full payment: check if ready-made (auto-deliver) or custom
                const fullOrder = await tx.order.findUnique({ where: { id: payment.orderId } });
                newOrderStatus = fullOrder.isCustom ? 'PaymentConfirmed' : 'ReadyForDelivery';
            }

            const updatedOrder = await tx.order.update({
                where: { id: payment.orderId },
                data: { status: newOrderStatus },
                include: {
                    user: { select: { id: true, fullName: true, email: true } },
                    deliveryAddress: true,
                    product: true,
                    payments: true,
                },
            });

            return { payment: updatedPayment, order: updatedOrder };
        });

        return { ...result, message: 'Payment verified and confirmed' };
    } else {
        // Payment was not successful
        await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'Failed' },
        });

        throw Object.assign(
            new Error(`Payment was not successful. Chapa status: ${chapaStatus}`),
            { statusCode: 400 }
        );
    }
}

/**
 * Get payment details for a specific order.
 *
 * @param {number} orderId – The order ID
 * @returns {Promise<Object>} – Payment details
 */
async function getPaymentByOrderId(orderId) {
    const payments = await prisma.payment.findMany({
        where: { orderId },
        include: {
            order: {
                select: {
                    id: true,
                    productName: true,
                    quantity: true,
                    totalPrice: true,
                    status: true,
                    userId: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    if (!payments.length) {
        throw Object.assign(new Error('No payments found for this order'), { statusCode: 404 });
    }

    return payments;
}

module.exports = {
    initiatePayment,
    handleCallback,
    getPaymentByOrderId,
};
