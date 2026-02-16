/**
 * Role constants for RBAC (matches Prisma `UserRole` enum)
 * Super Admin: Full system oversight, user management, financial access
 * Admin: Operational management, stock, production, content, tasks
 * Customer: Public interface, product browse, ordering, payment, tracking
 */
const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  CUSTOMER: 'Customer',
};

/** Roles allowed to access admin dashboard / admin-only routes */
const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN];

/** Super Admin only (sensitive data, user management) */
const SUPER_ADMIN_ROLES = [ROLES.SUPER_ADMIN];

module.exports = {
  ROLES,
  ADMIN_ROLES,
  SUPER_ADMIN_ROLES,
};
