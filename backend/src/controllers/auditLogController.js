const auditLogService = require('../services/auditLogService');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Get all audit logs with filtering and pagination
 * @route GET /api/audit-logs
 * @access SuperAdmin only
 */
exports.getAuditLogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      action,
      entity,
      userId,
      status,
      startDate,
      endDate,
      search,
    } = req.query;

    const filters = {
      action,
      entity,
      userId: userId ? parseInt(userId) : undefined,
      status,
      startDate,
      endDate,
      search,
    };

    const result = await auditLogService.getAuditLogs(
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.status(200).json({
      success: true,
      data: result.logs,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single audit log by ID
 * @route GET /api/audit-logs/:id
 * @access SuperAdmin only
 */
exports.getAuditLogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const log = await auditLogService.getAuditLogById(parseInt(id));

    if (!log) {
      return next(new ErrorResponse('Audit log not found', 404));
    }

    res.status(200).json({
      success: true,
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get audit log statistics
 * @route GET /api/audit-logs/stats
 * @access SuperAdmin only
 */
exports.getAuditLogStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await auditLogService.getAuditLogStats(startDate, endDate);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create audit log (internal use)
 * @route POST /api/audit-logs
 * @access SuperAdmin only
 */
exports.createAuditLog = async (req, res, next) => {
  try {
    const logData = {
      ...req.body,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
    };

    const log = await auditLogService.createAuditLog(logData);

    res.status(201).json({
      success: true,
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete old audit logs (cleanup)
 * @route DELETE /api/audit-logs/cleanup
 * @access SuperAdmin only
 */
exports.cleanupOldLogs = async (req, res, next) => {
  try {
    const { daysOld = 90 } = req.query;
    const result = await auditLogService.cleanupOldLogs(parseInt(daysOld));

    res.status(200).json({
      success: true,
      message: `Deleted ${result.count} audit logs older than ${daysOld} days`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
