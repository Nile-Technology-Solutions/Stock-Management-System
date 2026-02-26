/**
 * Super Admin API Service
 * Handles API calls for Super Admin specific endpoints
 * Based on Swagger API specification v1.4.0
 * Strictly connects to the real backend
 *
 * NOTE: Only endpoints defined in the Swagger spec are included.
 * Removed: /api/dashboard/super-admin, /api/financial/*, /api/settings
 * (those paths do not exist in the spec)
 */

import { api } from './api';

export const superAdminApi = {
  // ===================== USER MANAGEMENT =====================

  /**
   * Get all users
   * GET /api/users
   * @param {Object} params - Query parameters (page, limit, search, etc.)
   * @returns {Promise<Array>} Users list
   */
  getUsers: async (params = {}) => {
    return api.get('/api/users', params);
  },

  /**
   * Get user by ID
   * GET /api/users/{id}
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User details
   */
  getUserById: async (userId) => {
    return api.get(`/api/users/${userId}`);
  },

  /**
   * Create new user
   * POST /api/users
   * @param {Object} userData - User data (fullName, username, password, role, phone)
   * @returns {Promise<Object>} Created user
   */
  createUser: async (userData) => {
    return api.post('/api/users', userData);
  },

  /**
   * Update user
   * PUT /api/users/{id}
   * @param {number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user
   */
  updateUser: async (userId, userData) => {
    return api.put(`/api/users/${userId}`, userData);
  },

  /**
   * Delete user
   * DELETE /api/users/{id}
   * @param {number} userId - User ID
   */
  deleteUser: async (userId) => {
    return api.delete(`/api/users/${userId}`);
  },

  // ===================== REPORTS =====================

  /**
   * Reports endpoints for Super Admin.
   * All report endpoints accept optional params: from_date, to_date, format (json|csv|pdf)
   */
  reports: {
    /**
     * Get stock report
     * GET /api/reports/stock
     * @param {Object} params - { format }
     */
    stock: async (params = {}) => {
      return api.get('/api/reports/stock', params);
    },

    /**
     * Get production report
     * GET /api/reports/production
     * @param {Object} params - { from_date, to_date, format }
     */
    production: async (params = {}) => {
      return api.get('/api/reports/production', params);
    },

    /**
     * Get orders report
     * GET /api/reports/orders
     * @param {Object} params - { from_date, to_date, format }
     */
    orders: async (params = {}) => {
      return api.get('/api/reports/orders', params);
    },

    /**
     * Get payments report
     * GET /api/reports/payments
     * @param {Object} params - { from_date, to_date, format }
     */
    payments: async (params = {}) => {
      return api.get('/api/reports/payments', params);
    },

    /**
     * Get sales report
     * GET /api/reports/sales
     * @param {Object} params - { from_date, to_date, format }
     */
    sales: async (params = {}) => {
      return api.get('/api/reports/sales', params);
    }
  }
};

export default superAdminApi;
