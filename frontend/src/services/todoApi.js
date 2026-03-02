/**
 * Todo API Service
 * Strictly connects to the real backend for all task operations
 */

import { api } from './api';

export const todoApi = {
  /**
   * Get todos with optional day filter
   * GET /api/todo
   * @param {Object} params - Query parameters (day, etc.)
   * @returns {Promise<Array>} List of todo items
   */
  getTodos: async (params = {}) => {
    return api.get('/api/todo', params);
  },

  /**
   * Get todo by ID
   * GET /api/todo/{id}
   * @param {number} id - Todo ID
   * @returns {Promise<Object>} Todo item details
   */
  getTodoById: async (id) => {
    return api.get(`/api/todo/${id}`);
  },

  /**
   * Add new todo item
   * POST /api/todo
   * @param {Object} todoData - Todo item data
   * @returns {Promise<Object>} Created todo item
   */
  addTodo: async (todoData) => {
    return api.post('/api/todo', todoData);
  },

  /**
   * Update todo item
   * PUT /api/todo/{id}
   * @param {number} id - Todo ID
   * @param {Object} todoData - Updated todo item data
   * @returns {Promise<Object>} Updated todo item
   */
  updateTodo: async (id, todoData) => {
    return api.put(`/api/todo/${id}`, todoData);
  },

  /**
   * Delete todo item
   * DELETE /api/todo/{id}
   * @param {number} id - Todo ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteTodo: async (id) => {
    return api.delete(`/api/todo/${id}`);
  }
};

export default todoApi;
