/**
 * Product Showcase API Service
 * Handles finished products (showcase) according to Swagger API spec v1.4.0
 * Endpoints: /api/products
 *
 * Schema: FinishedProduct
 *   - id: integer
 *   - name: string (required)
 *   - categoryId: integer (required)
 *   - photos: Array<{ id, url, description }> (Photo schema)
 *   - color: string (required)
 *   - stockQuantity: integer (required)  <-- NOT "amount"
 *   - price: number
 *   - description: string
 */

import { api } from './api';

export const productApi = {
  /**
   * Get all finished products (Public)
   * GET /api/products
   * @param {Object} params - Query parameters (category, search, etc.)
   * @returns {Promise<Array<FinishedProduct>>} List of finished products
   */
  getProducts: async (params = {}) => {
    return api.get('/api/products', params);
  },

  /**
   * Get finished product by ID (Public)
   * GET /api/products/{id}
   * @param {number} id - Product ID
   * @returns {Promise<FinishedProduct>} Product details
   */
  getProductById: async (id) => {
    return api.get(`/api/products/${id}`);
  },

  /**
   * Add new finished product (Admin/Super Admin)
   * POST /api/products
   * @param {Object} productData - Product data
   * @param {string} productData.name - Product name
   * @param {number} productData.categoryId - Category ID
   * @param {Array<{url: string, description?: string}>} productData.photos - Product photos
   * @param {string} productData.color - Product color
   * @param {number} productData.stockQuantity - Available quantity in stock
   * @param {number} productData.price - Product price
   * @param {string} productData.description - Product description
   * @returns {Promise<FinishedProduct>} Created product
   */
  createProduct: async (productData) => {
    return api.post('/api/products', productData);
  },

  /**
   * Update finished product (Admin/Super Admin)
   * PUT /api/products/{id}
   * @param {number} id - Product ID
   * @param {Object} productData - Updated product data (same shape as createProduct)
   * @returns {Promise<FinishedProduct>} Updated product
   */
  updateProduct: async (id, productData) => {
    return api.put(`/api/products/${id}`, productData);
  },

  /**
   * Delete finished product (Admin/Super Admin)
   * DELETE /api/products/{id}
   * @param {number} id - Product ID
   */
  deleteProduct: async (id) => {
    return api.delete(`/api/products/${id}`);
  }
};

export default productApi;
