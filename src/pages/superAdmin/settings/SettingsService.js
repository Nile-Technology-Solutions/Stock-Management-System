/**
 * System Settings Service for SuperAdmin
 * Integrates with SuperAdmin API for system settings operations
 */

import { superAdminApi } from '../../../services/superAdminApi';

/**
 * Get system settings
 * @returns {Promise<Object>} System settings
 */
export const getSystemSettings = async () => {
  try {
    const data = await superAdminApi.settings.getSettings();
    const defaults = await getDefaultSettings();

    // Deep merge or at least ensure categories exist
    return {
      general: { ...defaults.general, ...(data?.general || {}) },
      notifications: { ...defaults.notifications, ...(data?.notifications || {}) },
      security: { ...defaults.security, ...(data?.security || {}) },
      backup: { ...defaults.backup, ...(data?.backup || {}) },
      api: { ...defaults.api, ...(data?.api || {}) }
    };
  } catch (error) {
    console.error('Failed to fetch system settings:', error);
    // Return defaults if API fails as a fallback
    return await getDefaultSettings();
  }
};

/**
 * Update system settings
 * @param {Object} settingsData - Settings data to update
 * @returns {Promise<Object>} Updated settings
 */
export const updateSystemSettings = async (settingsData) => {
  try {
    return await superAdminApi.settings.updateSettings(settingsData);
  } catch (error) {
    console.error('Failed to update system settings:', error);
    throw error;
  }
};

/**
 * Update general settings
 * @param {Object} generalSettings - General settings
 * @returns {Promise<Object>} Updated settings
 */
export const updateGeneralSettings = async (generalSettings) => {
  try {
    const currentSettings = await getSystemSettings();
    return await updateSystemSettings({
      ...currentSettings,
      general: {
        ...currentSettings.general,
        ...generalSettings
      }
    });
  } catch (error) {
    console.error('Failed to update general settings:', error);
    throw error;
  }
};

/**
 * Update notification settings
 * @param {Object} notificationSettings - Notification settings
 * @returns {Promise<Object>} Updated settings
 */
export const updateNotificationSettings = async (notificationSettings) => {
  try {
    const currentSettings = await getSystemSettings();
    return await updateSystemSettings({
      ...currentSettings,
      notifications: {
        ...currentSettings.notifications,
        ...notificationSettings
      }
    });
  } catch (error) {
    console.error('Failed to update notification settings:', error);
    throw error;
  }
};

/**
 * Update security settings
 * @param {Object} securitySettings - Security settings
 * @returns {Promise<Object>} Updated settings
 */
export const updateSecuritySettings = async (securitySettings) => {
  try {
    const currentSettings = await getSystemSettings();
    return await updateSystemSettings({
      ...currentSettings,
      security: {
        ...currentSettings.security,
        ...securitySettings
      }
    });
  } catch (error) {
    console.error('Failed to update security settings:', error);
    throw error;
  }
};

/**
 * Update backup settings
 * @param {Object} backupSettings - Backup settings
 * @returns {Promise<Object>} Updated settings
 */
export const updateBackupSettings = async (backupSettings) => {
  try {
    const currentSettings = await getSystemSettings();
    return await updateSystemSettings({
      ...currentSettings,
      backup: {
        ...currentSettings.backup,
        ...backupSettings
      }
    });
  } catch (error) {
    console.error('Failed to update backup settings:', error);
    throw error;
  }
};

/**
 * Update API settings
 * @param {Object} apiSettings - API settings
 * @returns {Promise<Object>} Updated settings
 */
export const updateAPISettings = async (apiSettings) => {
  try {
    const currentSettings = await getSystemSettings();
    return await updateSystemSettings({
      ...currentSettings,
      api: {
        ...currentSettings.api,
        ...apiSettings
      }
    });
  } catch (error) {
    console.error('Failed to update API settings:', error);
    throw error;
  }
};

/**
 * Reset settings to defaults
 * @param {string} category - Settings category to reset (optional)
 * @returns {Promise<Object>} Reset settings
 */
export const resetSettingsToDefaults = async (category = null) => {
  try {
    if (category) {
      // Reset specific category
      const defaultSettings = await getDefaultSettings();
      return await updateSystemSettings({
        [category]: defaultSettings[category]
      });
    } else {
      // Reset all settings
      return await updateSystemSettings(await getDefaultSettings());
    }
  } catch (error) {
    console.error('Failed to reset settings:', error);
    throw error;
  }
};

/**
 * Get default settings
 * @returns {Promise<Object>} Default settings
 */
const getDefaultSettings = async () => {
  // This would typically come from an API endpoint or config file
  return {
    general: {
      companyName: 'Nile Technology Solutions',
      companyEmail: 'info@niletech.com',
      companyPhone: '+251 11 123 4567',
      companyAddress: 'Bole, Addis Ababa, Ethiopia',
      timezone: 'Africa/Addis_Ababa',
      currency: 'ETB',
      dateFormat: 'DD/MM/YYYY'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      lowStockAlerts: true,
      orderNotifications: true,
      paymentAlerts: true,
      systemAlerts: true
    },
    security: {
      passwordMinLength: 8,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorAuth: false,
      ipWhitelist: [],
      auditLog: true
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 30,
      backupLocation: 'cloud',
      lastBackup: new Date().toISOString(),
      nextBackup: new Date().toISOString()
    },
    api: {
      rateLimit: 1000,
      corsEnabled: true,
      apiVersion: 'v1.4.0',
      swaggerEnabled: true,
      mockDataEnabled: true
    }
  };
};

/**
 * Validate settings
 * @param {Object} settings - Settings to validate
 * @returns {Object} Validation result
 */
export const validateSettings = (settings) => {
  const errors = [];
  const warnings = [];

  // Validate general settings
  if (settings.general) {
    if (!settings.general.companyName || settings.general.companyName.trim() === '') {
      errors.push('Company name is required');
    }
    if (!settings.general.companyEmail || !isValidEmail(settings.general.companyEmail)) {
      errors.push('Valid company email is required');
    }
  }

  // Validate security settings
  if (settings.security) {
    if (settings.security.passwordMinLength < 6) {
      warnings.push('Password minimum length should be at least 6 characters');
    }
    if (settings.security.sessionTimeout < 5) {
      warnings.push('Session timeout should be at least 5 minutes');
    }
  }

  // Validate backup settings
  if (settings.backup) {
    if (settings.backup.retentionPeriod < 7) {
      warnings.push('Backup retention period should be at least 7 days');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Export settings
 * @param {string} format - Export format (json, csv)
 * @returns {Promise<Blob>} Exported settings
 */
export const exportSettings = async (format = 'json') => {
  try {
    const settings = await getSystemSettings();

    switch (format.toLowerCase()) {
      case 'json':
        return new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
      case 'csv':
        // Convert settings to CSV format
        const csvData = convertSettingsToCSV(settings);
        return new Blob([csvData], { type: 'text/csv' });
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  } catch (error) {
    console.error('Failed to export settings:', error);
    throw error;
  }
};

/**
 * Import settings
 * @param {File} file - Settings file to import
 * @returns {Promise<Object>} Imported settings
 */
export const importSettings = async (file) => {
  try {
    const text = await file.text();
    const settings = JSON.parse(text);

    // Validate imported settings
    const validation = validateSettings(settings);
    if (!validation.isValid) {
      throw new Error(`Invalid settings: ${validation.errors.join(', ')}`);
    }

    return await updateSystemSettings(settings);
  } catch (error) {
    console.error('Failed to import settings:', error);
    throw error;
  }
};

/**
 * Convert settings to CSV format
 * @param {Object} settings - Settings object
 * @returns {string} CSV string
 */
const convertSettingsToCSV = (settings) => {
  const rows = [];

  // Helper function to flatten nested objects
  const flattenObject = (obj, prefix = '') => {
    const flattened = {};

    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        const nested = flattenObject(obj[key], `${prefix}${key}.`);
        Object.assign(flattened, nested);
      } else {
        flattened[`${prefix}${key}`] = obj[key];
      }
    }

    return flattened;
  };

  const flattened = flattenObject(settings);

  // Add header row
  rows.push(Object.keys(flattened).join(','));

  // Add data row
  rows.push(Object.values(flattened).map(value => `"${value}"`).join(','));

  return rows.join('\n');
};

export default {
  getSystemSettings,
  updateSystemSettings,
  updateGeneralSettings,
  updateNotificationSettings,
  updateSecuritySettings,
  updateBackupSettings,
  updateAPISettings,
  resetSettingsToDefaults,
  validateSettings,
  exportSettings,
  importSettings
};
