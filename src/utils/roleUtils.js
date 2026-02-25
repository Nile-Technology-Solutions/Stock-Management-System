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
  'superadmin': '/super-admin/dashboard',
  'admin': '/admin/dashboard',
  'customer': '/',
  'client': '/'
};

/**
 * Normalize role string for consistent comparison
 * @param {string} role - Original role string
 * @returns {string} - Normalized role
 */
export const normalizeRole = (role) => {
  if (!role) return '';
  return role.toString().toLowerCase().trim().replace(/\s+/g, '');
};

/**
 * Redirect user based on their role
 * @param {string} role - User role
 * @returns {string} - Redirect path
 */
export const redirectByRole = (role) => {
  const normalized = normalizeRole(role);
  return ROLE_DASHBOARDS[normalized] || '/';
};

/**
 * Check if user has required role or higher
 * @param {string} userRole - Current user's role
 * @param {string} requiredRole - Required role for access
 * @returns {boolean}
 */
export const hasRoleAccess = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  
  const normalizedUser = normalizeRole(userRole);
  const normalizedRequired = normalizeRole(requiredRole);
  
  // Find which key in ROLES matches the normalized string
  const roleKey = Object.keys(ROLES).find(k => normalizeRole(ROLES[k]) === normalizedUser);
  const userLevel = roleKey ? (ROLE_HIERARCHY[ROLES[roleKey]] ?? -1) : -1;
  
  const reqKey = Object.keys(ROLES).find(k => normalizeRole(ROLES[k]) === normalizedRequired);
  const requiredLevel = reqKey ? (ROLE_HIERARCHY[ROLES[reqKey]] ?? 0) : 0;
  
  return userLevel >= requiredLevel;
};

/**
 * Check if user has exact role (not hierarchical)
 * @param {string} userRole - Current user's role
 * @param {string} targetRole - Target role to check
 * @returns {boolean}
 */
export const hasExactRole = (userRole, targetRole) => {
  if (!userRole || !targetRole) return false;
  return normalizeRole(userRole) === normalizeRole(targetRole);
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
  
  if (!userRole) return false;
  
  const normalizedUserRole = normalizeRole(userRole);
  return allowedRoles.some(r => normalizeRole(r) === normalizedUserRole);
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
