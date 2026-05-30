/**
 * Order API Service
 * Handles sales orders according to API spec v1.4.0
 */

import { api } from './api';

export const orderApi = {
  /**
   * Get all orders
   * GET /api/orders
   * @returns {Promise<Array>} List of orders
   */
  getOrders: async () => {
    return api.get('/api/orders');
  },

  /**
   * Get order by ID
   * GET /api/orders/{id}
   * @param {number} id - Order ID
   * @returns {Promise<Object>} Order details
   */
  getOrderById: async (id) => {
    return api.get(`/api/orders/${id}`);
  },

  /**
   * Create new order
   * POST /api/orders
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Created order
   */
  createOrder: async (orderData) => {
    return api.post('/api/orders', orderData);
  },

  /**
   * Update order
   * PUT /api/orders/{id}
   * @param {number} id - Order ID
   * @param {Object} orderData - Updated order data
   * @returns {Promise<Object>} Updated order
   */
  updateOrder: async (id, orderData) => {
    return api.put(`/api/orders/${id}`, orderData);
  },

  /**
   * Delete order
   * DELETE /api/orders/{id}
   * @param {number} id - Order ID
   * @returns {Promise<Object>}
   */
  deleteOrder: async (id) => {
    return api.delete(`/api/orders/${id}`);
  },

  /**
   * Track order by ID (public alias for getOrderById)
   * @param {string|number} id - Order ID
   * @returns {Promise<Object>} Order status details
   */
  trackOrder: async (id) => {
    return api.get(`/api/orders/${id}`);
  }
};

export default orderApi;

