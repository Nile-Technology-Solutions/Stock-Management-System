/**
 * Production API Service
 * Handles manufacturing records according to API spec v1.4.0
 */

import { api } from './api';

export const productionApi = {
  /**
   * Get all production records
   * GET /api/production
   * @returns {Promise<Array>} List of production records
   */
  getProductionRecords: async () => {
    return api.get('/api/production');
  },

  /**
   * Get production record by ID
   * GET /api/production/{id}
   * @param {number} id - Production ID
   * @returns {Promise<Object>} Production record details
   */
  getProductionById: async (id) => {
    return api.get(`/api/production/${id}`);
  },

  /**
   * Create new production record
   * POST /api/production
   * @param {FormData|Object} productionData - Support multipart/form-data for photos
   * @returns {Promise<Object>} Created production record
   */
  createProduction: async (productionData) => {
    return api.post('/api/production', productionData);
  },

  /**
   * Update production record
   * PUT /api/production/{id}
   * @param {number} id - Production ID
   * @param {FormData|Object} productionData - Updated data
   * @returns {Promise<Object>} Updated record
   */
  updateProduction: async (id, productionData) => {
    return api.put(`/api/production/${id}`, productionData);
  },

  /**
   * Delete production record
   * DELETE /api/production/{id}
   * @param {number} id - Production ID
   * @returns {Promise<Object>}
   */
  deleteProduction: async (id) => {
    return api.delete(`/api/production/${id}`);
  }
};

export default productionApi;
