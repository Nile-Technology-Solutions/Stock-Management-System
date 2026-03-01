const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRoles } = require('../middleware/roleMiddleware');
const { SUPER_ADMIN_ROLES } = require('../constans/roles');

// All audit log routes are SuperAdmin only
router.use(authMiddleware);
router.use(requireRoles(SUPER_ADMIN_ROLES));

// Get audit log statistics
router.get('/stats', auditLogController.getAuditLogStats);

// Cleanup old logs
router.delete('/cleanup', auditLogController.cleanupOldLogs);

// Get all audit logs with filtering
router.get('/', auditLogController.getAuditLogs);

// Get single audit log
router.get('/:id', auditLogController.getAuditLogById);

// Create audit log (for testing or manual entry)
router.post('/', auditLogController.createAuditLog);

module.exports = router;
