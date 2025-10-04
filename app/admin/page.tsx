'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { ChartBar as BarChart3, Package, Users, ShoppingCart, TrendingUp, TriangleAlert as AlertTriangle, DollarSign, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AdminLayout } from '@/components/admin/layout';

interface KPIData {
  totalSales: number;
  revenue: number;
  profitMargin: number;
  lowStockCount: number;
  pendingPayments: number;
  newOrders: number;
  activeCustomers: number;
  conversionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'product' | 'user' | 'payment';
  message: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error';
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || !session.user.roles?.some(role => role.name === 'admin')) {
      redirect('/');
    }
  }, [session, status]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [kpiResponse, activityResponse] = await Promise.all([
        fetch('/api/admin/kpi'),
        fetch('/api/admin/activity')
      ]);

      if (kpiResponse.ok) {
        const kpiData = await kpiResponse.json();
        setKpiData(kpiData);
      }

      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData.activities);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  const kpiCards = [
    {
      title: 'Total Sales',
      value: kpiData?.totalSales || 0,
      change: '+12.5%',
      icon: ShoppingCart,
      color: 'text-blue-600',
    },
    {
      title: 'Revenue',
      value: `₹${(kpiData?.revenue || 0).toLocaleString()}`,
      change: '+8.2%',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Active Customers',
      value: kpiData?.activeCustomers || 0,
      change: '+15.3%',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Conversion Rate',
      value: `${kpiData?.conversionRate || 0}%`,
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-emerald-600',
    },
  ];

  const alerts = [
    {
      type: 'warning',
      message: `${kpiData?.lowStockCount || 0} products are running low on stock`,
      action: 'View Inventory',
      href: '/admin/products?filter=low-stock',
    },
    {
      type: 'info',
      message: `${kpiData?.pendingPayments || 0} payments are pending verification`,
      action: 'Review Payments',
      href: '/admin/orders?filter=pending-payment',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {card.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {card.change} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Alerts & Notifications</h2>
            <div className="grid gap-4">
              {alerts.map((alert, index) => (
                <Card key={index} className="border-l-4 border-l-amber-500">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <span className="text-sm">{alert.message}</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={alert.href}>{alert.action}</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart Placeholder */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Revenue and orders over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chart will be implemented with real data</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col" asChild>
                <a href="/admin/products/new">
                  <Package className="h-6 w-6 mb-2" />
                  Add Product
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex-col" asChild>
                <a href="/admin/orders">
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  View Orders
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex-col" asChild>
                <a href="/admin/customers">
                  <Users className="h-6 w-6 mb-2" />
                  Manage Users
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex-col" asChild>
                <a href="/admin/reports">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  View Reports
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}