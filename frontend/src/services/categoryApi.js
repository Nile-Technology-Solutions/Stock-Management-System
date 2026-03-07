import { api } from './api';

export const categoryApi = {
    /**
     * Get all categories (Public)
     * GET /api/categories
     * @returns {Promise<Array<Category>>} List of categories
     */
    getCategories: async () => {
        return api.get('/api/categories');
    },

    /**
     * Add new category (Admin/Super Admin)
     * POST /api/categories
     * @param {Object} categoryData - Category data
     * @param {string} categoryData.name - Category name
     * @param {string} [categoryData.description] - Category description
     * @param {number} [categoryData.parentId] - Optional parent category ID
     * @returns {Promise<Category>} Created category
     */
    createCategory: async (categoryData) => {
        return api.post('/api/categories', categoryData);
    },

    /**
     * Update category (Admin/Super Admin)
     * PUT /api/categories/{id}
     * @param {number} id - Category ID
     * @param {Object} categoryData - Updated category data
     * @returns {Promise<Category>} Updated category
     */
    updateCategory: async (id, categoryData) => {
        return api.put(`/api/categories/${id}`, categoryData);
    },

    /**
     * Delete category (Admin/Super Admin)
     * DELETE /api/categories/{id}
     * @param {number} id - Category ID
     */
    deleteCategory: async (id) => {
        return api.delete(`/api/categories/${id}`);
    }
};

export default categoryApi;
