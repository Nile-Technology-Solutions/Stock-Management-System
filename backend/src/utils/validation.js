/**
 * Validation utility functions for Stock Module
 * Validates stock item data for create and update operations based on OpenAPI spec
 */

/**
 * Validates data for creating a new stock item
 * Required fields: name, quantity, color, size, thickness, origin
 * 
 * @param {Object} data - Stock item data to validate
 * @param {string} data.name - Stock item name (required)
 * @param {number} data.quantity - Stock quantity (required, integer)
 * @param {string} data.color - Color (required)
 * @param {string} data.size - Size (required)
 * @param {string} data.thickness - Thickness (required)
 * @param {boolean} [data.laminated] - Laminated status (optional, default false)
 * @param {string} data.origin - Origin: "Local" or "Imported" (required)
 * @param {string} [data.typeNote] - Type note (optional)
 * @returns {Array<string>} Array of error messages (empty if valid)
 */
function validateStockCreate(data) {
  const errors = [];
  
  // Validate name (required)
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push('Name is required and must be a non-empty string');
  }
  
  // Validate quantity (required)
  if (data.quantity === undefined || data.quantity === null) {
    errors.push('Quantity is required');
  } else if (typeof data.quantity !== 'number' || !Number.isInteger(data.quantity)) {
    errors.push('Quantity must be an integer');
  } else if (data.quantity < 0) {
    errors.push('Quantity must be greater than or equal to 0');
  }
  
  // Validate color (required)
  if (!data.color || typeof data.color !== 'string' || data.color.trim() === '') {
    errors.push('Color is required and must be a non-empty string');
  }
  
  // Validate size (required)
  if (!data.size || typeof data.size !== 'string' || data.size.trim() === '') {
    errors.push('Size is required and must be a non-empty string');
  }
  
  // Validate thickness (required)
  if (!data.thickness || typeof data.thickness !== 'string' || data.thickness.trim() === '') {
    errors.push('Thickness is required and must be a non-empty string');
  }
  
  // Validate laminated (optional, must be boolean if provided)
  if (data.laminated !== undefined && typeof data.laminated !== 'boolean') {
    errors.push('Laminated must be a boolean');
  }
  
  // Validate origin (required, must be "Local" or "Imported")
  if (!data.origin || typeof data.origin !== 'string') {
    errors.push('Origin is required and must be a string');
  } else if (data.origin !== 'Local' && data.origin !== 'Imported') {
    errors.push('Origin must be either "Local" or "Imported"');
  }
  
  // Validate typeNote (optional)
  if (data.typeNote !== undefined && data.typeNote !== null && typeof data.typeNote !== 'string') {
    errors.push('TypeNote must be a string');
  }
  
  return errors;
}

/**
 * Validates data for updating an existing stock item
 * All fields are optional but must be valid if provided
 * 
 * @param {Object} data - Stock item data to validate
 * @param {string} [data.name] - Stock item name (optional)
 * @param {number} [data.quantity] - Stock quantity (optional, integer)
 * @param {string} [data.color] - Color (optional)
 * @param {string} [data.size] - Size (optional)
 * @param {string} [data.thickness] - Thickness (optional)
 * @param {boolean} [data.laminated] - Laminated status (optional)
 * @param {string} [data.origin] - Origin: "Local" or "Imported" (optional)
 * @param {string} [data.typeNote] - Type note (optional)
 * @returns {Array<string>} Array of error messages (empty if valid)
 */
function validateStockUpdate(data) {
  const errors = [];
  
  // Validate name (optional, but must be valid if provided)
  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('Name must be a non-empty string');
    }
  }
  
  // Validate quantity (optional, but must be valid if provided)
  if (data.quantity !== undefined) {
    if (typeof data.quantity !== 'number' || !Number.isInteger(data.quantity)) {
      errors.push('Quantity must be an integer');
    } else if (data.quantity < 0) {
      errors.push('Quantity must be greater than or equal to 0');
    }
  }
  
  // Validate color (optional, but must be valid if provided)
  if (data.color !== undefined) {
    if (typeof data.color !== 'string' || data.color.trim() === '') {
      errors.push('Color must be a non-empty string');
    }
  }
  
  // Validate size (optional, but must be valid if provided)
  if (data.size !== undefined) {
    if (typeof data.size !== 'string' || data.size.trim() === '') {
      errors.push('Size must be a non-empty string');
    }
  }
  
  // Validate thickness (optional, but must be valid if provided)
  if (data.thickness !== undefined) {
    if (typeof data.thickness !== 'string' || data.thickness.trim() === '') {
      errors.push('Thickness must be a non-empty string');
    }
  }
  
  // Validate laminated (optional, must be boolean if provided)
  if (data.laminated !== undefined && typeof data.laminated !== 'boolean') {
    errors.push('Laminated must be a boolean');
  }
  
  // Validate origin (optional, but must be valid if provided)
  if (data.origin !== undefined) {
    if (typeof data.origin !== 'string') {
      errors.push('Origin must be a string');
    } else if (data.origin !== 'Local' && data.origin !== 'Imported') {
      errors.push('Origin must be either "Local" or "Imported"');
    }
  }
  
  // Validate typeNote (optional)
  if (data.typeNote !== undefined && data.typeNote !== null && typeof data.typeNote !== 'string') {
    errors.push('TypeNote must be a string');
  }
  
  return errors;
}

module.exports = {
  validateStockCreate,
  validateStockUpdate
};
