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
   * @param {string} identifier - User's email or phone number
   * @param {string} password - User's password
   * @returns {Promise<{token: string, user: Object}>}
   */
  login: async (identifier, password) => {
    // Use real API
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Login failed' } }));
      // Extract the actual error message from the nested structure
      const errorMessage = errorData.error?.message || errorData.message || 'Invalid email/phone or password';
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    // Backend returns { success, message, data: { user, token } }
    if (result.success && result.data) {
      return {
        user: result.data.user,
        token: result.data.token
      };
    }
    
    // Fallback for different response structure
    return result;
  },

  /**
   * User Registration (for Customers)
   * POST /api/auth/register
   * @param {Object} userData - User registration data
   * @param {string} userData.fullName - User's full name
   * @param {string} userData.email - User's email address
   * @param {string} userData.phone - User's phone number
   * @param {string} userData.password - User's password
   * @param {string} userData.confirmPassword - Password confirmation
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
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        role: userData.role || 'Customer',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Registration failed' } }));
      // Extract the actual error message from the nested structure
      const errorMessage = errorData.error?.message || errorData.message || 'Unable to create account';
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    // Backend returns { success, message, data: { user, token } }
    if (result.success && result.data) {
      return result.data.user;
    }
    
    // Fallback for different response structure
    return result;
  },

  /**
   * Get current user profile
   * GET /api/auth/me
   * @returns {Promise<{success: boolean, data: {user: Object}}>} Current user profile
   */
  getProfile: async () => {
    const token = localStorage.getItem('ah_token');
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
    const token = localStorage.getItem('ah_token');
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
   * Request password reset
   * POST /api/auth/forgot-password
   * @param {string} identifier - User's email or phone number
   * @returns {Promise<{success: boolean, message: string}>}
   */
  forgotPassword: async (identifier) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Password reset request failed' }));
      throw new Error(error.message || 'Unable to process password reset request');
    }

    return await response.json();
  },

  /**
   * Reset password with token
   * POST /api/auth/reset-password
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @param {string} confirmPassword - Password confirmation
   * @returns {Promise<{success: boolean, message: string}>}
   */
  resetPassword: async (token, newPassword, confirmPassword) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Password reset failed' }));
      throw new Error(error.message || 'Unable to reset password');
    }

    return await response.json();
  },

  /**
   * Logout (clear local storage)
   */
  logout: () => {
    localStorage.removeItem('ah_token');
    localStorage.removeItem('ah_user');
  },

  /**
   * Get current user from local storage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('ah_user');
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

