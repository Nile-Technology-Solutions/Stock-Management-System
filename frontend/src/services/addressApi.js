/**
 * Address API Service
 * Handles user address management according to Swagger API spec v1.4.0
 * Endpoints: /api/addresses
 *
 * Schema: Address
 *   - id: integer
 *   - userId: integer
 *   - street: string
 *   - city: string
 *   - state: string
 *   - country: string
 *   - zipCode: string
 *   - isDefault: boolean
 */

import { api } from './api';

export const addressApi = {
    /**
     * Get all addresses for the logged-in user
     * GET /api/addresses
     * @returns {Promise<Array<Address>>} List of user addresses
     */
    getAddresses: async () => {
        return api.get('/api/addresses');
    },

    /**
     * Add a new address
     * POST /api/addresses
     * @param {Object} addressData - Address data
     * @param {string} addressData.street - Street name
     * @param {string} addressData.city - City
     * @param {string} addressData.state - State/Region
     * @param {string} addressData.country - Country
     * @param {string} addressData.zipCode - ZIP/Postal code
     * @param {boolean} [addressData.isDefault] - Whether this is the default address
     * @returns {Promise<Address>} Created address
     */
    createAddress: async (addressData) => {
        return api.post('/api/addresses', addressData);
    },

    /**
     * Update an address
     * PUT /api/addresses/{id}
     * @param {number} id - Address ID
     * @param {Object} addressData - Updated address data
     * @returns {Promise<Address>} Updated address
     */
    updateAddress: async (id, addressData) => {
        return api.put(`/api/addresses/${id}`, addressData);
    },

    /**
     * Delete an address
     * DELETE /api/addresses/{id}
     * @param {number} id - Address ID
     */
    deleteAddress: async (id) => {
        return api.delete(`/api/addresses/${id}`);
    }
};

export default addressApi;
