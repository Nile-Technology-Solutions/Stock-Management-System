/**
 * Chapa Payment Gateway Service
 * Wraps the Chapa API (https://developer.chapa.co/docs/accept-payments/)
 * Uses Node 18+ built-in fetch.
 */

const CHAPA_BASE_URL = 'https://api.chapa.co/v1';
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

/**
 * Initialize a transaction on Chapa.
 * POST https://api.chapa.co/v1/transaction/initialize
 *
 * @param {Object} params
 * @param {number|string} params.amount     – Amount in ETB
 * @param {string}        params.email      – Customer email
 * @param {string}        params.first_name – Customer first name
 * @param {string}        params.last_name  – Customer last name
 * @param {string}        params.phone_number – Customer phone (09xxxxxxxx)
 * @param {string}        params.tx_ref     – Unique transaction reference
 * @param {string}        params.callback_url – Server callback URL
 * @param {string}        params.return_url – Frontend redirect URL after payment
 * @param {Object}        [params.customization] – Optional title/description
 * @returns {Promise<{ checkout_url: string }>}
 */
async function initializeTransaction(params) {
    if (!CHAPA_SECRET_KEY) {
        throw Object.assign(
            new Error('Chapa secret key is not configured. Set CHAPA_SECRET_KEY in .env'),
            { statusCode: 500 }
        );
    }

    const payload = {
        amount: Number(params.amount).toFixed(2),
        currency: 'ETB',
        email: params.email,
        first_name: params.first_name,
        last_name: params.last_name,
        phone_number: params.phone_number,
        tx_ref: params.tx_ref,
        callback_url: params.callback_url,
        return_url: params.return_url,
        customization: params.customization
    };

    const response = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.status !== 'success') {
        const message = data.message
            ? (typeof data.message === 'object' ? JSON.stringify(data.message) : data.message)
            : 'Failed to initialize Chapa transaction';
        throw Object.assign(new Error(message), { statusCode: 502 });
    }

    return {
        checkout_url: data.data.checkout_url,
    };
}

/**
 * Verify a transaction on Chapa.
 * GET https://api.chapa.co/v1/transaction/verify/<tx_ref>
 *
 * @param {string} txRef – The tx_ref used when initializing
 * @returns {Promise<Object>} – Chapa verification response data
 */
async function verifyTransaction(txRef) {
    if (!CHAPA_SECRET_KEY) {
        throw Object.assign(
            new Error('Chapa secret key is not configured. Set CHAPA_SECRET_KEY in .env'),
            { statusCode: 500 }
        );
    }

    const response = await fetch(
        `${CHAPA_BASE_URL}/transaction/verify/${encodeURIComponent(txRef)}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok || data.status !== 'success') {
        const message = data.message || 'Failed to verify Chapa transaction';
        throw Object.assign(new Error(message), { statusCode: 502 });
    }

    return data.data; // Contains status, amount, currency, tx_ref, etc.
}

module.exports = {
    initializeTransaction,
    verifyTransaction,
};
