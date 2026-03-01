import api from './api';

const auditLogService = {
  /**
   * Get audit logs with filtering and pagination
   */
  getAuditLogs: async (params = {}) => {
    const response = await api.get('/audit-logs', { params });
    return response.data;
  },

  /**
   * Get a single audit log by ID
   */
  getAuditLogById: async (id) => {
    const response = await api.get(`/audit-logs/${id}`);
    return response.data;
  },

  /**
   * Get audit log statistics
   */
  getAuditLogStats: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await api.get('/audit-logs/stats', { params });
    return response.data;
  },

  /**
   * Cleanup old audit logs
   */
  cleanupOldLogs: async (daysOld = 90) => {
    const response = await api.delete('/audit-logs/cleanup', {
      params: { daysOld },
    });
    return response.data;
  },
};

export default auditLogService;
