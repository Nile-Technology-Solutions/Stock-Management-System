import API_BASE_URL from './api';

/**
 * Stock Management Public API Service
 * Handles products, categories, news, and orders for public interface
 */

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create headers
const createHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const stockApi = {
  // ==================== PRODUCTS ====================
  
  /**
   * Get all products (public)
   * GET /api/products
   * @param {Object} params - Query parameters
   * @param {string} params.category - Filter by category
   * @param {string} params.search - Search query
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise<Array>} List of products
   */
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = `${API_BASE_URL}/api/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch products' }));
      throw new Error(error.message || 'Unable to load products');
    }

    return await response.json();
  },

  /**
   * Get single product by ID
   * GET /api/products/:id
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product details
   */
  getProductById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Product not found' }));
      throw new Error(error.message || 'Unable to load product details');
    }

    return await response.json();
  },

  // ==================== CATEGORIES ====================
  
  /**
   * Get all categories
   * GET /api/categories
   * @returns {Promise<Array>} List of categories
   */
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch categories' }));
      throw new Error(error.message || 'Unable to load categories');
    }

    return await response.json();
  },

  // ==================== NEWS ====================
  
  /**
   * Get published news articles
   * GET /api/news
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise<Array>} List of published news
   */
  getNews: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = `${API_BASE_URL}/api/news${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch news' }));
      throw new Error(error.message || 'Unable to load news');
    }

    return await response.json();
  },

  // ==================== ORDERS ====================
  
  /**
   * Create new order
   * POST /api/orders
   * @param {Object} orderData - Order information
   * @param {string} orderData.productId - Product ID
   * @param {number} orderData.quantity - Order quantity
   * @param {string} orderData.customerName - Customer full name
   * @param {string} orderData.customerEmail - Customer email
   * @param {string} orderData.customerPhone - Customer phone
   * @param {string} orderData.deliveryAddress - Delivery address
   * @param {string} orderData.paymentMethod - Payment method (Chapa/Telebirr)
   * @returns {Promise<{orderId: string, paymentUrl: string}>} Order ID and payment URL
   */
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: createHeaders(false), // Public endpoint, no auth required
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Order creation failed' }));
      throw new Error(error.message || 'Unable to place order');
    }

    return await response.json();
  },

  /**
   * Get order status by ID
   * GET /api/orders/:id
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order details with status
   */
  getOrderStatus: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      method: 'GET',
      headers: createHeaders(false), // Public endpoint for tracking
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Order not found' }));
      throw new Error(error.message || 'Unable to retrieve order status');
    }

    return await response.json();
  },

  /**
   * Track order by ID (public tracking)
   * GET /api/orders/track/:id
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Order tracking information
   */
  trackOrder: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/api/orders/track/${orderId}`, {
      method: 'GET',
      headers: createHeaders(false),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Order not found' }));
      throw new Error(error.message || 'Unable to track order');
    }

    return await response.json();
  },
};

export default stockApi;
