'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Package, Truck, CircleCheck as CheckCircle, Circle as XCircle, Clock, Eye, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalINR: number;
  currency: string;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    priceINR: number;
    product: {
      images: string[];
    };
  }>;
  shipments: Array<{
    id: string;
    awb?: string;
    courier?: string;
    status: string;
    trackingUrl?: string;
  }>;
}

const statusConfig = {
  pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  paid: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Paid' },
  processing: { icon: Package, color: 'bg-blue-100 text-blue-800', label: 'Processing' },
  shipped: { icon: Truck, color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Cancelled' },
  refunded: { icon: RotateCcw, color: 'bg-gray-100 text-gray-800', label: 'Refunded' },
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/orders');
      return;
    }

    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/reorder`, {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/cart');
      }
    } catch (error) {
      console.error('Failed to reorder:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && !['delivered', 'cancelled', 'refunded'].includes(order.status)) ||
                      (activeTab === 'completed' && ['delivered', 'cancelled', 'refunded'].includes(order.status));

    return matchesSearch && matchesStatus && matchesTab;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your spice orders</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="active">
              Active ({orders.filter(o => !['delivered', 'cancelled', 'refunded'].includes(o.status)).length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({orders.filter(o => ['delivered', 'cancelled', 'refunded'].includes(o.status)).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'You haven\'t placed any orders yet'
                    }
                  </p>
                  <Link href="/products">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Start Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
                  const StatusIcon = statusInfo?.icon || Clock;

                  return (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">#{order.orderNumber}</h3>
                              <Badge className={statusInfo?.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo?.label}
                              </Badge>
                              {order.paymentStatus === 'paid' && (
                                <Badge variant="outline" className="text-green-600 border-green-200">
                                  Paid
                                </Badge>
                              )}
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-3">
                              <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                              <p className="font-medium text-gray-900">
                                Total: ₹{Number(order.totalINR).toFixed(2)}
                              </p>
                            </div>

                            {/* Order Items Preview */}
                            <div className="flex items-center gap-2 mb-3">
                              {order.items.slice(0, 3).map((item, index) => (
                                <img
                                  key={index}
                                  src={item.product.images[0] || '/placeholder-spice.jpg'}
                                  alt={item.name}
                                  className="w-10 h-10 object-cover rounded border"
                                />
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-600">
                                  +{order.items.length - 3}
                                </div>
                              )}
                              <span className="text-sm text-gray-600 ml-2">
                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                              </span>
                            </div>

                            {/* Tracking Info */}
                            {order.shipments.length > 0 && order.shipments[0].awb && (
                              <div className="text-sm text-gray-600">
                                <p>
                                  <span className="font-medium">Tracking:</span> {order.shipments[0].awb}
                                  {order.shipments[0].courier && (
                                    <span className="ml-2">via {order.shipments[0].courier}</span>
                                  )}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Link href={`/orders/${order.id}`}>
                              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </Link>
                            
                            {order.shipments.length > 0 && order.shipments[0].trackingUrl && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={order.shipments[0].trackingUrl} target="_blank" rel="noopener noreferrer">
                                  <Truck className="w-4 h-4 mr-2" />
                                  Track
                                </a>
                              </Button>
                            )}

                            {order.status === 'delivered' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReorder(order.id)}
                              >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reorder
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}