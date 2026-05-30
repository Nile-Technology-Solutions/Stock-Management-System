/**
 * User Management Service for Super Admin
 * Integrates with Super Admin API for user operations
 */

import { superAdminApi } from '../../../services/superAdminApi';

/**
 * Get users with pagination and filtering
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Users data with pagination
 */
export const getUsers = async (params = {}) => {
  try {
    return await superAdminApi.getUsers(params);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};

/**
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User details
 */
export const getUserById = async (userId) => {
  try {
    return await superAdminApi.getUserById(userId);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
};

/**
 * Create new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (userData) => {
  try {
    return await superAdminApi.createUser(userData);
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

/**
 * Update existing user
 * @param {number} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (userId, userData) => {
  try {
    return await superAdminApi.updateUser(userId, userData);
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};

/**
 * Delete user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteUser = async (userId) => {
  try {
    return await superAdminApi.deleteUser(userId);
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
};

/**
 * Search users by query
 * @param {string} query - Search query
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Search results
 */
export const searchUsers = async (query, params = {}) => {
  try {
    return await superAdminApi.getUsers({ ...params, search: query });
  } catch (error) {
    console.error('Failed to search users:', error);
    throw error;
  }
};

/**
 * Get users by role
 * @param {string} role - User role
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Users by role
 */
export const getUsersByRole = async (role, params = {}) => {
  try {
    return await superAdminApi.getUsers({ ...params, role });
  } catch (error) {
    console.error('Failed to fetch users by role:', error);
    throw error;
  }
};

/**
 * Bulk operations on users
 * @param {Array} userIds - Array of user IDs
 * @param {string} operation - Operation type (activate, deactivate, delete)
 * @returns {Promise<Object>} Operation results
 */
export const bulkUserOperation = async (userIds, operation) => {
  const results = [];
  
  for (const userId of userIds) {
    try {
      let result;
      switch (operation) {
        case 'activate':
          result = await updateUser(userId, { isActive: true });
          break;
        case 'deactivate':
          result = await updateUser(userId, { isActive: false });
          break;
        case 'delete':
          result = await deleteUser(userId);
          break;
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
      results.push({ userId, success: true, result });
    } catch (error) {
      results.push({ userId, success: false, error: error.message });
    }
  }
  
  return {
    operation,
    total: userIds.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  getUsersByRole,
  bulkUserOperation
};
