const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create an audit log entry
 */
exports.createAuditLog = async (logData) => {
  const {
    userId,
    userEmail,
    userRole,
    action,
    entity,
    entityId,
    description,
    ipAddress,
    userAgent,
    metadata,
    status = 'Success',
  } = logData;

  return await prisma.auditLog.create({
    data: {
      userId,
      userEmail,
      userRole,
      action,
      entity,
      entityId,
      description,
      ipAddress,
      userAgent,
      metadata,
      status,
    },
  });
};

/**
 * Get audit logs with filtering and pagination
 */
exports.getAuditLogs = async (page = 1, limit = 50, filters = {}) => {
  const skip = (page - 1) * limit;
  const where = {};

  // Apply filters
  if (filters.action) {
    where.action = filters.action;
  }

  if (filters.entity) {
    where.entity = filters.entity;
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.createdAt.lte = new Date(filters.endDate);
    }
  }

  if (filters.search) {
    where.OR = [
      { description: { contains: filters.search, mode: 'insensitive' } },
      { userEmail: { contains: filters.search, mode: 'insensitive' } },
      { entity: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get a single audit log by ID
 */
exports.getAuditLogById = async (id) => {
  return await prisma.auditLog.findUnique({
    where: { id },
  });
};

/**
 * Get audit log statistics
 */
exports.getAuditLogStats = async (startDate, endDate) => {
  const where = {};

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  const [
    totalLogs,
    actionStats,
    entityStats,
    statusStats,
    recentActivity,
  ] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.groupBy({
      by: ['action'],
      where,
      _count: { action: true },
      orderBy: { _count: { action: 'desc' } },
    }),
    prisma.auditLog.groupBy({
      by: ['entity'],
      where,
      _count: { entity: true },
      orderBy: { _count: { entity: 'desc' } },
    }),
    prisma.auditLog.groupBy({
      by: ['status'],
      where,
      _count: { status: true },
    }),
    prisma.auditLog.findMany({
      where,
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        action: true,
        entity: true,
        userEmail: true,
        createdAt: true,
        status: true,
      },
    }),
  ]);

  return {
    totalLogs,
    actionStats: actionStats.map((stat) => ({
      action: stat.action,
      count: stat._count.action,
    })),
    entityStats: entityStats.map((stat) => ({
      entity: stat.entity,
      count: stat._count.entity,
    })),
    statusStats: statusStats.map((stat) => ({
      status: stat.status,
      count: stat._count.status,
    })),
    recentActivity,
  };
};

/**
 * Delete audit logs older than specified days
 */
exports.cleanupOldLogs = async (daysOld = 90) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await prisma.auditLog.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate,
      },
    },
  });

  return result;
};

/**
 * Helper function to log user actions (can be called from other services)
 */
exports.logUserAction = async (req, action, entity, entityId, description, metadata = null) => {
  try {
    const logData = {
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
    };

    await this.createAuditLog(logData);
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to prevent disrupting main operation
  }
};
