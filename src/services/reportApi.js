/**
 * Report API Service
 * Handles all report-related API calls
 */

import { API_BASE_URL, getAuthHeaders } from './api';

/**
 * Handle API errors and map to user-friendly messages
 */
const handleApiError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // Handled by redirect in main error handler
        throw new Error('Authentication required');
      case 403:
        throw new Error('Access denied. You do not have permission to view this report.');
      case 404:
        throw new Error('Report not found.');
      case 500:
      case 502:
      case 503:
      case 504:
        throw new Error('Server error. Please try again later.');
      default:
        throw new Error(error.response.data?.message || 'Request failed');
    }
  } else if (error.request) {
    throw new Error('Network error. Please check your connection and try again.');
  } else {
    throw new Error('An unexpected error occurred');
  }
};

/**
 * Get report data in JSON format
 * @param {string} endpoint - Report endpoint (e.g., '/api/reports/stock')
 * @param {Object} params - Query parameters (format, from_date, to_date)
 * @returns {Promise<Object>} Report data
 */
export const getReport = async (endpoint, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    // Handle authentication errors
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    // Handle other errors
    if (!response.ok) {
      const error = new Error('Request failed');
      error.response = {
        status: response.status,
        data: await response.json().catch(() => ({}))
      };
      throw error;
    }

    return await response.json();
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Download report as CSV or PDF
 * @param {string} endpoint - Report endpoint (e.g., '/api/reports/stock')
 * @param {Object} params - Query parameters (format, from_date, to_date)
 * @returns {Promise<Blob>} File blob for download
 */
export const downloadReport = async (endpoint, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    // Handle authentication errors
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    // Handle other errors
    if (!response.ok) {
      const error = new Error('Request failed');
      error.response = {
        status: response.status,
        data: await response.json().catch(() => ({}))
      };
      throw error;
    }

    return await response.blob();
  } catch (error) {
    throw handleApiError(error);
  }
};

const reportApi = {
  getReport,
  downloadReport
};

export default reportApi;
