'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CircleCheck as CheckCircle, Clock, MapPin, CreditCard, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface OrderItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  priceINR: number;
  totalINR: number;
  giftNote?: string;
  product: {
    images: string[];
    slug: string;
  };
}

interface Address {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotalINR: number;
  taxAmountINR: number;
  shippingINR: number;
  discountINR: number;
  totalINR: number;
  couponCode?: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  payments: any[];
  shipments: any[];
}

const statusConfig = {
  pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  paid: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Paid' },
  processing: { icon: Package, color: 'bg-blue-100 text-blue-800', label: 'Processing' },
  shipped: { icon: Truck, color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Delivered' },
  cancelled: { icon: Clock, color: 'bg-red-100 text-red-800', label: 'Cancelled' },
};

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchOrder();
    }
  }, [status, params.orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else if (response.status === 404) {
        router.push('/orders');
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
          <Link href="/orders">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = statusInfo?.icon || Clock;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/orders" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600 mt-2">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.product.images[0] || '/placeholder-spice.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg border"
                        />
                      </div>
                      <div className="flex-1">
                        <Link href={`/products/${item.product.slug}`}>
                          <h3 className="font-semibold hover:text-emerald-600 transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        {item.giftNote && (
                          <p className="text-sm text-amber-600 mt-1">
                            Gift Note: {item.giftNote}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{Number(item.totalINR).toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          ₹{Number(item.priceINR).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                    {index < order.items.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.shipments.length > 0 ? (
                  <div className="space-y-4">
                    {order.shipments.map((shipment: any) => (
                      <div key={shipment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">Tracking: {shipment.awb || 'Not assigned'}</p>
                            <p className="text-sm text-gray-600">
                              Courier: {shipment.courier || 'TBD'}
                            </p>
                          </div>
                          <Badge variant="outline">{shipment.status}</Badge>
                        </div>
                        {shipment.trackingUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={shipment.trackingUrl} target="_blank" rel="noopener noreferrer">
                              Track Package
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Shipping information will be updated once the order is processed.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Addresses */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{Number(order.subtotalINR).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{Number(order.shippingINR) === 0 ? 'Free' : `₹${Number(order.shippingINR).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (GST)</span>
                  <span>₹{Number(order.taxAmountINR).toFixed(2)}</span>
                </div>
                {Number(order.discountINR) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                    <span>-₹{Number(order.discountINR).toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{Number(order.totalINR).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p>Phone: {order.shippingAddress.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">
                    {order.billingAddress.firstName} {order.billingAddress.lastName}
                  </p>
                  <p>{order.billingAddress.addressLine1}</p>
                  {order.billingAddress.addressLine2 && (
                    <p>{order.billingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                  </p>
                  <p>{order.billingAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
              {order.status === 'delivered' && (
                <Button variant="outline" className="w-full">
                  Reorder Items
                </Button>
              )}
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}