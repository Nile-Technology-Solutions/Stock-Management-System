/**
 * Product Showcase API Service
 * Handles finished products (showcase) according to Swagger API spec v1.4.0
 * Endpoints: /api/products
 */

import { api } from './api';

export const productApi = {
  /**
   * Get all finished products (Public)
   * GET /api/products
   * @param {Object} params - Query parameters (category, search, etc.)
   * @returns {Promise<Array>} List of finished products
   */
  getProducts: async (params = {}) => {
    return api.get('/api/products', params);
  },

  /**
   * Get finished product by ID (Public)
   * GET /api/products/{id}
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Product details
   */
  getProductById: async (id) => {
    return api.get(`/api/products/${id}`);
  },

  /**
   * Add new finished product (Admin/Super Admin)
   * POST /api/products
   * @param {Object} productData - Product data
   * @param {string} productData.category - Product category (Bed, Door, Table, Cabinet, Other)
   * @param {Array<string>} productData.photos - Product photos URLs
   * @param {string} productData.color - Product color
   * @param {number} productData.amount - Available quantity
   * @param {number} productData.price - Product price
   * @param {string} productData.description - Product description
   * @returns {Promise<Object>} Created product
   */
  createProduct: async (productData) => {
    return api.post('/api/products', productData);
  },

  /**
   * Update finished product (Admin/Super Admin)
   * PUT /api/products/{id}
   * @param {number} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} Updated product
   */
  updateProduct: async (id, productData) => {
    return api.put(`/api/products/${id}`, productData);
  },

  /**
   * Delete finished product (Admin/Super Admin)
   * DELETE /api/products/{id}
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteProduct: async (id) => {
    return api.delete(`/api/products/${id}`);
  }
};

export default productApi;
