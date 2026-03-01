const auditLogService = require('../services/auditLogService');

/**
 * Middleware to automatically log API requests
 * Usage: Add to routes that need audit logging
 */
const auditLogger = (action, entity) => {
  return async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;
    
    // Override send function to capture response
    res.send = function (data) {
      // Restore original send
      res.send = originalSend;
      
      // Determine status based on response
      let status = 'Success';
      if (res.statusCode >= 400) {
        status = 'Failed';
      } else if (res.statusCode >= 300) {
        status = 'Warning';
      }
      
      // Extract entity ID from various sources
      let entityId = req.params.id || req.body.id || null;
      
      // Build description
      let description = `${action} ${entity}`;
      if (entityId) {
        description += ` #${entityId}`;
      }
      
      // Log the action asynchronously (don't block response)
      setImmediate(async () => {
        try {
          await auditLogService.createAuditLog({
            userId: req.user?.id,
            userEmail: req.user?.email,
            userRole: req.user?.role,
            action,
            entity,
            entityId,
            description,
            ipAddress: req.ip || req.connection?.remoteAddress,
            userAgent: req.get('user-agent'),
            metadata: {
              method: req.method,
              path: req.path,
              query: req.query,
              statusCode: res.statusCode,
            },
            status,
          });
        } catch (error) {
          console.error('Failed to create audit log:', error);
        }
      });
      
      // Send the response
      return originalSend.call(this, data);
    };
    
    next();
  };
};

/**
 * Helper to log specific actions manually
 */
const logAction = async (req, action, entity, entityId, description, metadata = null) => {
  try {
    await auditLogService.createAuditLog({
      userId: req.user?.id,
      userEmail: req.user?.email,
      userRole: req.user?.role,
      action,
      entity,
      entityId,
      description,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent'),
      metadata,
      status: 'Success',
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};

module.exports = {
  auditLogger,
  logAction,
};
