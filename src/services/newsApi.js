/**
 * News API Service
 * Strictly connects to the real backend for all news operations
 */

import { api, API_BASE_URL, getAuthToken } from './api';

export const newsApi = {
  /**
   * Get all news posts
   * GET /api/news
   * @returns {Promise<Array>} List of news posts
   */
  getNews: async () => {
    return api.get('/api/news/public');
  },

  /**
   * Get news post by ID
   * GET /api/news/{id}
   * @param {number} id - News post ID
   * @returns {Promise<Object>} News post details
   */
  getNewsById: async (id) => {
    return api.get(`/api/news/public/${id}`);
  },

  /**
   * Create new news post with file upload support
   * POST /api/news
   * @param {Object} newsData - News post data
   * @param {File[]} photos - Array of photo files
   * @returns {Promise<Object>} Created news post
   */
  createNews: async (newsData, photos = []) => {
    const formData = new FormData();
    formData.append('title', newsData.title);
    formData.append('content', newsData.content);
    formData.append('status', newsData.status || 'Published');
    if (newsData.publishDate) {
      formData.append('publishDate', newsData.publishDate);
    }
    
    // Append photo files
    photos.forEach(photo => {
      formData.append('photos', photo);
    });

    const response = await fetch(`${API_BASE_URL}/api/news`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create news post');
    }

    return response.json();
  },

  /**
   * Update news post with file upload support
   * PUT /api/news/{id}
   * @param {number} id - News post ID
   * @param {Object} newsData - Updated news post data
   * @param {File[]} photos - Array of photo files (optional)
   * @returns {Promise<Object>} Updated news post
   */
  updateNews: async (id, newsData, photos = []) => {
    const formData = new FormData();
    formData.append('title', newsData.title);
    formData.append('content', newsData.content);
    formData.append('status', newsData.status || 'Published');
    if (newsData.publishDate) {
      formData.append('publishDate', newsData.publishDate);
    }
    
    // Append photo files if provided
    photos.forEach(photo => {
      formData.append('photos', photo);
    });

    const response = await fetch(`${API_BASE_URL}/api/news/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to update news post');
    }

    return response.json();
  },

  /**
   * Delete news post
   * DELETE /api/news/{id}
   * @param {number} id - News post ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteNews: async (id) => {
    return api.delete(`/api/news/${id}`);
  }
};

export default newsApi;
