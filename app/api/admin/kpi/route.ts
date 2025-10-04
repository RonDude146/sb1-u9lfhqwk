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

    // Get current date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch KPI data
    const [
      totalOrders,
      paidOrders,
      totalRevenue,
      lowStockProducts,
      pendingPayments,
      activeCustomers,
    ] = await Promise.all([
      // Total orders this month
      db.order.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      
      // Paid orders this month
      db.order.count({
        where: {
          paymentStatus: 'paid',
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      
      // Total revenue this month
      db.order.aggregate({
        where: {
          paymentStatus: 'paid',
          createdAt: {
            gte: startOfMonth,
          },
        },
        _sum: {
          totalINR: true,
        },
      }),
      
      // Low stock products
      db.productVariant.count({
        where: {
          stockQty: {
            lte: db.productVariant.fields.lowStockQty,
          },
          isActive: true,
        },
      }),
      
      // Pending payments
      db.payment.count({
        where: {
          status: {
            in: ['created', 'authorized'],
          },
        },
      }),
      
      // Active customers (ordered in last 30 days)
      db.user.count({
        where: {
          orders: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      }),
    ]);

    // Calculate conversion rate (mock calculation)
    const conversionRate = totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : 0;

    const kpiData = {
      totalSales: totalOrders,
      revenue: Number(totalRevenue._sum.totalINR) || 0,
      profitMargin: 25, // Mock profit margin
      lowStockCount: lowStockProducts,
      pendingPayments: pendingPayments,
      newOrders: totalOrders,
      activeCustomers: activeCustomers,
      conversionRate: conversionRate,
    };

    return NextResponse.json(kpiData);
  } catch (error) {
    console.error('KPI API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}