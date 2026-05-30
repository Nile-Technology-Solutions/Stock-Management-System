/**
 * Base API Service
 * Centralized API configuration and utilities
 * Centralized API configuration for AddHomes Creative Woodworks
 */

import { apiConfig } from '../config/env';

// API Base URL
export const API_BASE_URL = apiConfig.baseURL;

/**
 * Get authentication token from storage
 */
export const getAuthToken = () => {
  return localStorage.getItem(apiConfig.tokenKey) || localStorage.getItem('authToken');
};

/**
 * Set authentication token in storage
 */
export const setAuthToken = (token) => {
  localStorage.setItem(apiConfig.tokenKey, token);
  localStorage.setItem('authToken', token); // Backward compatibility
};

/**
 * Remove authentication token from storage
 */
export const removeAuthToken = () => {
  localStorage.removeItem(apiConfig.tokenKey);
  localStorage.removeItem('authToken');
};

/**
 * Get standard headers for API requests
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Generic API request wrapper with error handling
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      ...(!options.body || !(options.body instanceof FormData) ? getAuthHeaders() : (getAuthToken() ? { 'Authorization': `Bearer ${getAuthToken()}` } : {})),
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);

    // Handle authentication errors
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
      throw new Error('Authentication required. Please log in again.');
    }

    // Handle authorization errors
    if (response.status === 403) {
      throw new Error('Access denied. You do not have permission to perform this action.');
    }

    // Handle not found errors
    if (response.status === 404) {
      throw new Error('Resource not found.');
    }

    // Handle server errors
    if (response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }

    // Parse response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      const errorMessage = errorData.message || `Request failed: ${response.statusText}`;
      const errorDetails = errorData.details ? `\n${errorData.details.join('\n')}` : '';
      throw new Error(errorMessage + errorDetails);
    }

    // Return parsed JSON or empty object for 204 No Content
    if (response.status === 204) {
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * API Methods
 */
export const api = {
  get: (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return apiRequest(url, { method: 'GET' });
  },

  post: (endpoint, data = {}) => {
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  postMultipart: (endpoint, formData) => {
    // For FormData, do not set Content-Type; the browser will set it with the correct boundary
    const token = getAuthToken();
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    return apiRequest(endpoint, {
      method: 'POST',
      body: formData,
      headers
    });
  },

  put: (endpoint, data = {}) => {
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  patch: (endpoint, data = {}) => {
    return apiRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  delete: (endpoint) => {
    return apiRequest(endpoint, { method: 'DELETE' });
  }
};

export default api;
