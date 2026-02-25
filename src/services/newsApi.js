/**
 * News API Service
 * Strictly connects to the real backend for all news operations
 */

import { api } from './api';

export const newsApi = {
  /**
   * Get all news posts
   * GET /api/news
   * @returns {Promise<Array>} List of news posts
   */
  getNews: async () => {
    return api.get('/api/news');
  },

  /**
   * Get news post by ID
   * GET /api/news/{id}
   * @param {number} id - News post ID
   * @returns {Promise<Object>} News post details
   */
  getNewsById: async (id) => {
    return api.get(`/api/news/${id}`);
  },

  /**
   * Create new news post
   * POST /api/news
   * @param {Object} newsData - News post data
   * @returns {Promise<Object>} Created news post
   */
  createNews: async (newsData) => {
    return api.post('/api/news', newsData);
  },

  /**
   * Update news post
   * PUT /api/news/{id}
   * @param {number} id - News post ID
   * @param {Object} newsData - Updated news post data
   * @returns {Promise<Object>} Updated news post
   */
  updateNews: async (id, newsData) => {
    return api.put(`/api/news/${id}`, newsData);
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
