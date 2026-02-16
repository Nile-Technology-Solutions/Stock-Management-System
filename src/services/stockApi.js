/**
 * Stock Management API Service
 * Integrated with SMS Backend API v1.4.0
 * Handles raw materials and inventory for furniture manufacturing
 */

import { apiConfig } from '../config/env';

// API Configuration
const API_BASE_URL = apiConfig.baseURL || 'http://localhost:5000';

// Get authentication token
const getAuthToken = () => localStorage.getItem('sms_token') || localStorage.getItem('authToken');

// Get authentication headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Stock API Service Methods
 * Endpoints: /api/stock
 */
export const stockApi = {
  /**
   * Get all stock materials
   * GET /api/stock
   */
  async getAllStock() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stock`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stock: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Get all stock error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get stock material by ID
   * GET /api/stock/{id}
   */
  async getStockById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stock/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stock item: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Get stock by ID error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Add new stock material
   * POST /api/stock
   * 
   * Required fields:
   * - name: string
   * - quantity: number
   * - color: string (optional)
   * - size: string (optional)
   * - thickness: string (optional)
   * - laminated: boolean (optional)
   * - origin: "Imported" | "Local" (optional)
   * - typeNote: string (optional)
   */
  async createStock(stockData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stock`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(stockData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create stock: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Create stock error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update stock material
   * PUT /api/stock/{id}
   */
  async updateStock(id, stockData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stock/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(stockData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update stock: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Update stock error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete stock material
   * DELETE /api/stock/{id}
   */
  async deleteStock(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stock/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete stock: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Delete stock error:', error);
      return { success: false, error: error.message };
    }
  }
};

/**
 * Helper functions for stock data validation and formatting
 */
export const stockApiHelpers = {
  /**
   * Validate stock data before sending to backend
   */
  validateStockData(stockData) {
    const errors = [];

    if (!stockData.name || stockData.name.trim() === '') {
      errors.push('Material name is required');
    }

    if (stockData.quantity === undefined || stockData.quantity === null || stockData.quantity < 0) {
      errors.push('Quantity must be a non-negative number');
    }

    return { valid: errors.length === 0, errors };
  },

  /**
   * Format stock data for API
   */
  formatStockForApi(stockData) {
    return {
      name: stockData.name?.trim(),
      quantity: parseInt(stockData.quantity) || 0,
      color: stockData.color?.trim() || null,
      size: stockData.size?.trim() || null,
      thickness: stockData.thickness?.trim() || null,
      laminated: stockData.laminated === true || stockData.laminated === 'true',
      origin: stockData.origin || null,
      typeNote: stockData.typeNote?.trim() || null
    };
  },

  /**
   * Handle API errors consistently
   */
  handleApiError(error) {
    console.error('Stock API Error:', error);

    if (error.message.includes('401')) {
      localStorage.removeItem('sms_token');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return 'Authentication required. Please log in again.';
    }

    if (error.message.includes('403')) {
      return 'Access denied. You do not have permission to perform this action.';
    }

    if (error.message.includes('404')) {
      return 'Stock item not found.';
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Network error. Please check your connection.';
    }

    return error.message || 'An unexpected error occurred';
  }
};

export default stockApi;
