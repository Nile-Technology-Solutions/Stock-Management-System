import { API_BASE_URL } from '../config/env';

/**
 * Authentication API Service
 * Handles login and registration according to API spec v1.4.0
 * Strictly connects to the real backend
 */

export const authApi = {
  /**
   * User Login
   * POST /api/auth/login
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<{token: string, user: Object}>}
   */
  login: async (username, password) => {
    // Use real API
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Invalid username or password');
    }

    return await response.json();
  },

  /**
   * User Registration (for Customers)
   * POST /api/auth/register
   * @param {Object} userData - User registration data
   * @param {string} userData.fullName - User's full name
   * @param {string} userData.username - Desired username
   * @param {string} userData.password - User's password
   * @param {string} userData.role - User role (default: "Customer")
   * @returns {Promise<Object>} Created user object
   */
  register: async (userData) => {
    // Use real API
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: userData.fullName,
        username: userData.username,
        password: userData.password,
        role: userData.role || 'Customer',
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(error.message || 'Unable to create account');
    }

    return await response.json();
  },

  /**
   * Get current user profile
   * GET /api/auth/me
   * @returns {Promise<{success: boolean, data: {user: Object}}>} Current user profile
   */
  getProfile: async () => {
    const token = localStorage.getItem('sms_token');
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch profile' }));
      throw new Error(error.message || 'Unable to retrieve profile');
    }

    return await response.json();
  },

  /**
   * Change user password
   * PUT /api/auth/change-password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<{success: boolean, message: string}>}
   */
  changePassword: async (oldPassword, newPassword) => {
    const token = localStorage.getItem('sms_token');
    const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Password change failed' }));
      throw new Error(error.message || 'Unable to change password');
    }

    return await response.json();
  },

  /**
   * Logout (clear local storage)
   */
  logout: () => {
    localStorage.removeItem('sms_token');
    localStorage.removeItem('sms_user');
  },

  /**
   * Get current user from local storage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('sms_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};

export default authApi;

