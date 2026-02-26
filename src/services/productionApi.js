/**
 * Production API Service
 * Handles manufacturing records according to API spec v1.4.0
 * POST/PUT use multipart/form-data per Swagger spec (supports photo uploads)
 */

import { API_BASE_URL } from '../config/env';
import { api, getAuthToken } from './api';

/**
 * Helper: send a multipart/form-data request.
 * Converts a plain object to FormData if needed.
 */
const multipartRequest = async (url, method, data) => {
  let body;
  if (data instanceof FormData) {
    body = data;
  } else {
    // Convert plain object to FormData
    body = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => body.append(key, item));
      } else if (value !== undefined && value !== null) {
        body.append(key, value);
      }
    });
  }

  const token = getAuthToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // Do NOT set Content-Type — browser sets it automatically with boundary for FormData

  const response = await fetch(`${API_BASE_URL}${url}`, { method, headers, body });

  if (response.status === 401) {
    localStorage.removeItem('sms_token');
    window.location.href = '/login';
    throw new Error('Authentication required. Please log in again.');
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed: ${response.statusText}`);
  }
  if (response.status === 204) return {};
  return response.json();
};

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
   * POST /api/production  (multipart/form-data)
   * @param {FormData|Object} productionData - Fields: categoryId, title, notes, photos (File[])
   * @returns {Promise<Object>} Created production record
   */
  createProduction: async (productionData) => {
    return multipartRequest('/api/production', 'POST', productionData);
  },

  /**
   * Update production record
   * PUT /api/production/{id}  (multipart/form-data)
   * @param {number} id - Production ID
   * @param {FormData|Object} productionData - Fields: status, progressPercentage, photos (File[])
   * @returns {Promise<Object>} Updated record
   */
  updateProduction: async (id, productionData) => {
    return multipartRequest(`/api/production/${id}`, 'PUT', productionData);
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
