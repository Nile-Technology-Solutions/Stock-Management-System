/**
 * Report Configuration
 * Defines all available reports and their properties
 */

export const REPORT_CONFIGS = [
  {
    type: 'stock',
    title: 'Stock Report',
    hasDateFilter: false,
    endpoint: '/api/reports/stock',
    roles: ['Admin', 'SuperAdmin']
  },
  {
    type: 'production',
    title: 'Production Report',
    hasDateFilter: true,
    endpoint: '/api/reports/production',
    roles: ['Admin', 'SuperAdmin']
  },
  {
    type: 'orders',
    title: 'Orders Report',
    hasDateFilter: true,
    endpoint: '/api/reports/orders',
    roles: ['Admin', 'SuperAdmin']
  },
  {
    type: 'payments',
    title: 'Payments Report',
    hasDateFilter: true,
    endpoint: '/api/reports/payments',
    roles: ['SuperAdmin']
  },
  {
    type: 'sales',
    title: 'Sales Report',
    hasDateFilter: true,
    endpoint: '/api/reports/sales',
    roles: ['Admin', 'SuperAdmin']
  }
];

/**
 * Get reports filtered by user role
 * @param {string} userRole - User's role (Admin, SuperAdmin, etc.)
 * @returns {Array} Filtered array of report configurations
 */
export const getReportsForRole = (userRole) => {
  if (!userRole) {
    return [];
  }
  
  return REPORT_CONFIGS.filter(report => 
    report.roles.includes(userRole)
  );
};

export default {
  REPORT_CONFIGS,
  getReportsForRole
};
