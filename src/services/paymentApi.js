/**
 * Payment API Service
 * Handles payment operations via Chapa gateway
 * Endpoints: /api/payments/*
 */

import { api } from './api';

export const paymentApi = {
  /**
   * Initiate payment for order
   * POST /api/payments/initiate
   * @param {Object} paymentData - { orderId: number }
   * @returns {Promise<{ success, data: { checkoutUrl, paymentId, txRef } }>}
   */
  initiatePayment: async (paymentData) => {
    return api.post('/api/payments/initiate', paymentData);
  },

  /**
   * Verify payment after Chapa redirect
   * POST /api/payments/verify
   * @param {string} txRef - Transaction reference from Chapa
   * @returns {Promise<{ success, data: { payment, order } }>}
   */
  verifyPayment: async (txRef) => {
    return api.post('/api/payments/verify', { txRef });
  },

  /**
   * Get payment details by order ID
   * GET /api/payments/{orderId}
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>} Payment details
   */
  getPaymentByOrderId: async (orderId) => {
    return api.get(`/api/payments/${orderId}`);
  }
};

export default paymentApi;
