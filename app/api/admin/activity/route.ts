import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.roles?.some(role => role.name === 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch recent audit logs for activity feed
    const auditLogs = await db.auditLog.findMany({
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Transform audit logs into activity feed format
    const activities = auditLogs.map(log => ({
      id: log.id,
      type: log.resource as 'order' | 'product' | 'user' | 'payment',
      message: generateActivityMessage(log),
      timestamp: formatTimestamp(log.createdAt),
      status: getActivityStatus(log.action),
    }));

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Activity API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateActivityMessage(log: any): string {
  const userName = log.user?.name || 'Unknown user';
  
  switch (log.resource) {
    case 'order':
      switch (log.action) {
        case 'create':
          return `New order placed by ${userName}`;
        case 'update':
          return `Order ${log.resourceId} status updated`;
        default:
          return `Order ${log.action} by ${userName}`;
      }
    case 'product':
      switch (log.action) {
        case 'create':
          return `New product added by ${userName}`;
        case 'update':
          return `Product updated by ${userName}`;
        default:
          return `Product ${log.action} by ${userName}`;
      }
    case 'user':
      switch (log.action) {
        case 'create':
          return `New user registered: ${userName}`;
        case 'login':
          return `${userName} signed in`;
        default:
          return `User ${log.action}: ${userName}`;
      }
    case 'payment':
      switch (log.action) {
        case 'create':
          return `Payment initiated by ${userName}`;
        case 'update':
          return `Payment status updated`;
        default:
          return `Payment ${log.action} by ${userName}`;
      }
    default:
      return `${log.action} performed by ${userName}`;
  }
}

function getActivityStatus(action: string): 'success' | 'warning' | 'error' | undefined {
  switch (action) {
    case 'create':
    case 'login':
      return 'success';
    case 'update':
      return undefined;
    case 'delete':
      return 'warning';
    default:
      return undefined;
  }
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}