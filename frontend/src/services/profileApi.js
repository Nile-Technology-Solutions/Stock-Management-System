/**
 * Profile API Service
 * Handles user profile operations
 */

import { api, API_BASE_URL, getAuthToken } from './api';

export const profileApi = {
  /**
   * Get current user profile
   * GET /api/profile
   */
  getProfile: async () => {
    return api.get('/api/profile');
  },

  /**
   * Update user profile
   * PUT /api/profile
   */
  updateProfile: async (profileData) => {
    return api.put('/api/profile', profileData);
  },

  /**
   * Upload profile picture
   * POST /api/profile/picture
   */
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/profile/picture`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Failed to upload profile picture');
    }

    return await response.json();
  },

  /**
   * Change password
   * PUT /api/auth/change-password
   */
  changePassword: async (oldPassword, newPassword) => {
    return api.put('/api/auth/change-password', { oldPassword, newPassword });
  },

  /**
   * Get user's purchase history
   * GET /api/orders (filtered by current user)
   */
  getPurchaseHistory: async () => {
    return api.get('/api/orders');
  },

  /**
   * Get user's addresses
   * GET /api/addresses
   */
  getAddresses: async () => {
    return api.get('/api/addresses');
  },

  /**
   * Add new address
   * POST /api/addresses
   */
  addAddress: async (addressData) => {
    return api.post('/api/addresses', addressData);
  },

  /**
   * Update address
   * PUT /api/addresses/{id}
   */
  updateAddress: async (id, addressData) => {
    return api.put(`/api/addresses/${id}`, addressData);
  },

  /**
   * Delete address
   * DELETE /api/addresses/{id}
   */
  deleteAddress: async (id) => {
    return api.delete(`/api/addresses/${id}`);
  },

  /**
   * Submit feedback
   * POST /api/profile/feedback
   */
  submitFeedback: async (feedbackData) => {
    return api.post('/api/profile/feedback', feedbackData);
  },

  /**
   * Contact support
   * POST /api/profile/support
   */
  contactSupport: async (supportData) => {
    return api.post('/api/profile/support', supportData);
  },

  /**
   * Get notifications
   * GET /api/profile/notifications
   */
  getNotifications: async () => {
    return api.get('/api/profile/notifications');
  },

  /**
   * Mark notification as read
   * PUT /api/profile/notifications/{id}/read
   */
  markNotificationRead: async (id) => {
    return api.put(`/api/profile/notifications/${id}/read`);
  },

  /**
   * Get user preferences
   * GET /api/profile/preferences
   */
  getPreferences: async () => {
    return api.get('/api/profile/preferences');
  },

  /**
   * Update user preferences
   * PUT /api/profile/preferences
   */
  updatePreferences: async (preferences) => {
    return api.put('/api/profile/preferences', preferences);
  }
};

export default profileApi;
