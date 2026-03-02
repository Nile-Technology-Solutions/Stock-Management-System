/**
 * Payment API Service
 * Handles payment operations according to Swagger API spec v1.4.0
 * Endpoints: /api/payments/*
 */

import { api } from './api';

export const paymentApi = {
  /**
   * Initiate payment for order
   * POST /api/payments/initiate
   * @param {Object} paymentData - Payment initiation data
   * @param {number} paymentData.orderId - Order ID
   * @param {string} paymentData.gateway - Payment gateway (Chapa or Telebirr)
   * @returns {Promise<Object>} Payment initiation response with checkoutUrl
   */
  initiatePayment: async (paymentData) => {
    return api.post('/api/payments/initiate', paymentData);
  },

  /**
   * Payment callback (from gateway)
   * POST /api/payments/callback
   * @param {Object} callbackData - Payment callback data from gateway
   * @returns {Promise<Object>} Payment processing confirmation
   */
  paymentCallback: async (callbackData) => {
    return api.post('/api/payments/callback', callbackData);
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
