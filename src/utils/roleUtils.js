/**
 * Role-based Access Control Utilities
 * Centralized role management and redirect logic
 */

// Role constants match mockData.js strings
export const ROLES = {
  CLIENT: 'Customer',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin'
};

// Role hierarchy for permission checking
export const ROLE_HIERARCHY = {
  [ROLES.CLIENT]: 0,
  [ROLES.ADMIN]: 1,
  [ROLES.SUPER_ADMIN]: 2
};

// Default dashboard routes for each role
export const ROLE_DASHBOARDS = {
  [ROLES.SUPER_ADMIN]: '/super-admin/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.CLIENT]: '/'
};

/**
 * Redirect user based on their role
 * @param {string} role - User role
 * @returns {string} - Redirect path
 */
export const redirectByRole = (role) => {
  return ROLE_DASHBOARDS[role] || '/';
};

/**
 * Check if user has required role or higher
 * @param {string} userRole - Current user's role
 * @param {string} requiredRole - Required role for access
 * @returns {boolean}
 */
export const hasRoleAccess = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  
  const userLevel = ROLE_HIERARCHY[userRole] ?? -1;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;
  
  return userLevel >= requiredLevel;
};

/**
 * Check if user has exact role (not hierarchical)
 * @param {string} userRole - Current user's role
 * @param {string} targetRole - Target role to check
 * @returns {boolean}
 */
export const hasExactRole = (userRole, targetRole) => {
  return userRole === targetRole;
};

/**
 * Check if user role is in allowed roles array
 * @param {string} userRole - Current user's role
 * @param {Array<string>} allowedRoles - Array of allowed roles
 * @returns {boolean}
 */
export const isRoleAllowed = (userRole, allowedRoles = []) => {
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    return true; // No restrictions
  }
  return allowedRoles.includes(userRole);
};

/**
 * Get user role display name
 * @param {string} role - User role
 * @returns {string}
 */
export const getRoleDisplayName = (role) => {
  const displayNames = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.ADMIN]: 'Admin',
    [ROLES.CLIENT]: 'Customer'
  };
  return displayNames[role] || role;
};

/**
 * Check if role is admin or higher
 * @param {string} role - User role
 * @returns {boolean}
 */
export const isAdminOrHigher = (role) => {
  return hasRoleAccess(role, ROLES.ADMIN);
};

/**
 * Check if role is super admin
 * @param {string} role - User role
 * @returns {boolean}
 */
export const isSuperAdmin = (role) => {
  return role === ROLES.SUPER_ADMIN;
};

/**
 * Check if role is client/customer
 * @param {string} role - User role
 * @returns {boolean}
 */
export const isClient = (role) => {
  return role === ROLES.CLIENT;
};
