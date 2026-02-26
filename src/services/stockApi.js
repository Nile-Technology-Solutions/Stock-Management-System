/**
 * Stock Management API Service
 * Integrated with SMS Backend API v1.4.0
 * Handles raw materials and inventory for furniture manufacturing
 * Strictly connects to the real backend
 */

import { apiConfig } from '../config/env';

// API Configuration
const API_BASE_URL = apiConfig.baseURL || 'http://localhost:5000';

const getCategoryLabel = (category) => {
  if (!category) return '';
  if (typeof category === 'string') return category;
  if (typeof category === 'object') return category.name || category.title || '';
  return String(category);
};

const normalizeProductForPublic = (product) => {
  if (!product || typeof product !== 'object') return product;

  const photos = Array.isArray(product.photos) ? product.photos : [];
  const firstPhoto = photos[0];
  const firstPhotoUrl = typeof firstPhoto === 'string' ? firstPhoto : firstPhoto?.url;

  return {
    ...product,
    category: getCategoryLabel(product.category),
    image: product.image || firstPhotoUrl || null
  };
};

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
  },

  /** Aliases for public-facing components */
  async getProducts(params = {}) {
    // Use real API
    const data = await this.getAllStock();
    if (data.success) {
      const stockItems = Array.isArray(data.data) ? data.data : [];
      let products = stockItems.map(normalizeProductForPublic);

      if (params.category && params.category !== 'all') {
        products = products.filter(p => p.category === params.category);
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        products = products.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.typeNote?.toLowerCase().includes(query)
        );
      }
      return products;
    }
    throw new Error(data.error);
  },

  async getCategories() {
    // Use real API
    const data = await this.getAllStock();
    if (data.success) {
      const stockItems = Array.isArray(data.data) ? data.data : [];
      const categories = [...new Set(stockItems.map(p => getCategoryLabel(p.category)).filter(Boolean))];
      return categories;
    }
    return [];
  },

  async getProductById(id) {
    // Use real API
    const data = await this.getStockById(id);
    if (data.success) {
      return normalizeProductForPublic(data.data);
    }
    throw new Error(data.error);
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

    // Required by Swagger spec: origin must be 'Local' or 'Imported'
    const validOrigins = ['Local', 'Imported'];
    if (!stockData.origin || !validOrigins.includes(stockData.origin)) {
      errors.push('Origin is required and must be \'Local\' or \'Imported\'');
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
      // origin is required: 'Local' | 'Imported'
      origin: stockData.origin || null,
      // categoryId links to the Category schema
      categoryId: stockData.categoryId ? parseInt(stockData.categoryId) : null,
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


