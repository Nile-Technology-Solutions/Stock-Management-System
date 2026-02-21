import { API_BASE_URL, apiConfig } from '../config/env';
import { mockUsers } from './mockData';

/**
 * Authentication API Service
 * Handles login and registration according to API spec v1.4.0
 */

const USE_MOCK = apiConfig.useMock;

// Generate a mock JWT token
const generateMockToken = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId: user.id, 
    username: user.username, 
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

export const authApi = {
  /**
   * User Login
   * POST /api/auth/login
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<{token: string, user: Object}>}
   */
  login: async (username, password) => {
    // Use mock authentication
    if (USE_MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user by username
      const user = mockUsers.find(u => u.username === username);
      
      if (!user) {
        throw new Error('Invalid username or password');
      }
      
      // Check password
      if (user.password !== password) {
        throw new Error('Invalid username or password');
      }
      
      // Generate mock token
      const token = generateMockToken(user);
      
      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        token,
        user: userWithoutPassword
      };
    }

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
    // Use mock registration
    if (USE_MOCK) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if username already exists
      const existingUser = mockUsers.find(u => u.username === userData.username);
      if (existingUser) {
        throw new Error('Username already exists');
      }
      
      // Create new user
      const newUser = {
        id: mockUsers.length + 1,
        fullName: userData.fullName,
        username: userData.username,
        password: userData.password,
        role: userData.role || 'Customer',
        email: userData.email || `${userData.username}@sms.com`
      };
      
      // Add to mock users (in memory only)
      mockUsers.push(newUser);
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    }

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
   * Logout (clear local storage)
   */
  logout: () => {
    localStorage.removeItem('sms_token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from token
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
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
