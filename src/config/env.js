/**
 * Environment Configuration
 * API Base URL and other environment-specific settings
 */

// API Configuration based on API_ANALYSIS.md
export const apiConfig = {
  // Base URL for SMS Backend API v1.4.0
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  
  // Request timeout in milliseconds
  timeout: 30000,
  
  // Retry configuration
  retryAttempts: 3,
  retryDelay: 1000,
  
  // Token storage key
  tokenKey: 'sms_token'
};

// Export individual values for convenience
export const API_BASE_URL = apiConfig.baseURL;
export const API_TIMEOUT = apiConfig.timeout;
export const TOKEN_KEY = apiConfig.tokenKey;

export default apiConfig;
