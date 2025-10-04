import { db } from '../db';

export interface AuditLogData {
  userId: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'view';
  resource: string;
  resourceId?: string;
  oldData?: any;
  newData?: any;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        oldData: data.oldData ? JSON.stringify(data.oldData) : null,
        newData: data.newData ? JSON.stringify(data.newData) : null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

export async function getAuditLogs(params: {
  userId?: string;
  resource?: string;
  action?: string;
  page?: number;
  limit?: number;
}) {
  const { userId, resource, action, page = 1, limit = 50 } = params;
  
  const where: any = {};
  if (userId) where.userId = userId;
  if (resource) where.resource = resource;
  if (action) where.action = action;

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.auditLog.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}