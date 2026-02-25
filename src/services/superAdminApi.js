/**
 * Super Admin API Service
 * Handles API calls for Super Admin specific endpoints
 * Based on Swagger API specification
 * Strictly connects to the real backend
 */

import { api } from './api';

/**
 * Super Admin API endpoints
 */
export const superAdminApi = {
  /**
   * Get Super Admin dashboard data with financial statistics
   * GET /api/dashboard/super-admin
   * @param {Object} params - Query parameters (timeRange, etc.)
   * @returns {Promise<Object>} Dashboard data
   */
  getDashboardData: async (params = {}) => {
    return api.get('/api/dashboard/super-admin', params);
  },

  /**
   * Get users for user management
   * GET /api/users
   * @param {Object} params - Query parameters (page, limit, search, etc.)
   * @returns {Promise<Object>} Users list
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
   * @param {Object} userData - User data
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
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteUser: async (userId) => {
    return api.delete(`/api/users/${userId}`);
  },

  /**
   * Reports endpoints for Super Admin
   */
  reports: {
    /**
     * Get stock reports
     * GET /api/reports/stock
     * @param {Object} params - Query parameters (timeRange, etc.)
     * @returns {Promise<Object>} Stock reports
     */
    stock: async (params = {}) => {
      return api.get('/api/reports/stock', params);
    },

    /**
     * Get production reports
     * GET /api/reports/production
     * @param {Object} params - Query parameters (timeRange, etc.)
     * @returns {Promise<Object>} Production reports
     */
    production: async (params = {}) => {
      return api.get('/api/reports/production', params);
    },

    /**
     * Get order reports
     * GET /api/reports/orders
     * @param {Object} params - Query parameters (timeRange, etc.)
     * @returns {Promise<Object>} Order reports
     */
    orders: async (params = {}) => {
      return api.get('/api/reports/orders', params);
    },

    /**
     * Get payment reports
     * GET /api/reports/payments
     * @param {Object} params - Query parameters (timeRange, etc.)
     * @returns {Promise<Object>} Payment reports
     */
    payments: async (params = {}) => {
      return api.get('/api/reports/payments', params);
    },

    /**
     * Get sales reports
     * GET /api/reports/sales
     * @param {Object} params - Query parameters (timeRange, etc.)
     * @returns {Promise<Object>} Sales reports
     */
    sales: async (params = {}) => {
      return api.get('/api/reports/sales', params);
    }
  },

  /**
   * Financial audit endpoints
   */
  financial: {
    /**
     * Get revenue statistics
     * GET /api/financial/revenue
     * @param {Object} params - Query parameters (timeRange, etc.)
     * @returns {Promise<Object>} Revenue statistics
     */
    getRevenue: async (params = {}) => {
      return api.get('/api/financial/revenue', params);
    },

    /**
     * Get financial summary
     * GET /api/financial/summary
     * @param {Object} params - Query parameters (timeRange, etc.)
     * @returns {Promise<Object>} Financial summary
     */
    getSummary: async (params = {}) => {
      return api.get('/api/financial/summary', params);
    }
  },

  /**
   * System settings endpoints
   */
  settings: {
    /**
     * Get system settings
     * GET /api/settings
     * @returns {Promise<Object>} System settings
     */
    getSettings: async () => {
      return api.get('/api/settings');
    },

    /**
     * Update system settings
     * PUT /api/settings
     * @param {Object} settingsData - Settings data
     * @returns {Promise<Object>} Updated settings
     */
    updateSettings: async (settingsData) => {
      return api.put('/api/settings', settingsData);
    }
  }
};

export default superAdminApi;

