'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, Users, Package, TrendingUp, FileText, Calculator, Clock, CircleCheck as CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BusinessAccount {
  id: string;
  companyName: string;
  businessType: string;
  isApproved: boolean;
  creditLimit: number;
  gstin?: string;
}

interface Quote {
  id: string;
  status: string;
  totalEstimateINR?: number;
  createdAt: string;
  items: Array<{
    product: { name: string };
    variant: { name: string };
    quantity: number;
    priceINR: number;
  }>;
}

export default function B2BPortalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [businessAccount, setBusinessAccount] = useState<BusinessAccount | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/b2b');
      return;
    }

    if (status === 'authenticated') {
      if (!session.user.isBusinessAccount) {
        router.push('/b2b/signup');
        return;
      }
      fetchB2BData();
    }
  }, [status, session, router]);

  const fetchB2BData = async () => {
    try {
      const [accountResponse, quotesResponse] = await Promise.all([
        fetch('/api/b2b/account'),
        fetch('/api/b2b/quotes')
      ]);

      if (accountResponse.ok) {
        const accountData = await accountResponse.json();
        setBusinessAccount(accountData.account);
      }

      if (quotesResponse.ok) {
        const quotesData = await quotesResponse.json();
        setQuotes(quotesData.quotes || []);
      }
    } catch (error) {
      console.error('Failed to fetch B2B data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading B2B portal...</p>
        </div>
      </div>
    );
  }

  if (!businessAccount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Business Account Required</h1>
          <p className="text-gray-600 mb-6">
            You need a business account to access the B2B portal.
          </p>
          <Link href="/b2b/signup">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Apply for Business Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    requested: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Requested' },
    reviewed: { icon: FileText, color: 'bg-blue-100 text-blue-800', label: 'Under Review' },
    quoted: { icon: Calculator, color: 'bg-purple-100 text-purple-800', label: 'Quoted' },
    approved: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Approved' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Building2 className="w-8 h-8 text-emerald-600" />
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900">
                B2B Portal
              </h1>
              <p className="text-gray-600">Welcome, {businessAccount.companyName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge className={businessAccount.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {businessAccount.isApproved ? 'Approved Account' : 'Pending Approval'}
            </Badge>
            <Badge variant="outline">
              {businessAccount.businessType.charAt(0).toUpperCase() + businessAccount.businessType.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Account Status Alert */}
        {!businessAccount.isApproved && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Account Under Review</h3>
                  <p className="text-yellow-700">
                    Your business account is currently being reviewed. You'll receive an email once approved.
                    Some features may be limited until approval.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Credit Limit</p>
                  <p className="text-2xl font-bold">₹{businessAccount.creditLimit?.toLocaleString() || '0'}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Quotes</p>
                  <p className="text-2xl font-bold">{quotes.filter(q => q.status !== 'converted').length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Package className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Account Type</p>
                  <p className="text-lg font-bold capitalize">{businessAccount.businessType}</p>
                </div>
                <Users className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="quotes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="account">Account Details</TabsTrigger>
          </TabsList>

          {/* Quotes Tab */}
          <TabsContent value="quotes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Quote Requests</CardTitle>
                <Link href="/b2b/quote/new">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Request New Quote
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {quotes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No quotes yet</h3>
                    <p className="text-gray-600 mb-6">
                      Request a quote for bulk orders and get competitive pricing
                    </p>
                    <Link href="/b2b/quote/new">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Request Your First Quote
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quotes.map((quote) => {
                      const statusInfo = statusConfig[quote.status as keyof typeof statusConfig];
                      const StatusIcon = statusInfo?.icon || Clock;
                      
                      return (
                        <div key={quote.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold">Quote #{quote.id.slice(-8)}</h3>
                              <Badge className={statusInfo?.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo?.label}
                              </Badge>
                            </div>
                            <div className="text-right">
                              {quote.totalEstimateINR && (
                                <p className="font-semibold text-emerald-600">
                                  ₹{Number(quote.totalEstimateINR).toLocaleString()}
                                </p>
                              )}
                              <p className="text-sm text-gray-500">
                                {new Date(quote.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-3">
                            <p>{quote.items.length} items requested</p>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                              {quote.items.slice(0, 3).map((item, index) => (
                                <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {item.product.name}
                                </span>
                              ))}
                              {quote.items.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{quote.items.length - 3} more
                                </span>
                              )}
                            </div>
                            <Link href={`/b2b/quotes/${quote.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>B2B Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-6">
                    Your B2B orders will appear here once you start purchasing
                  </p>
                  <Link href="/products">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Details Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Company Name</label>
                    <p className="text-lg font-semibold">{businessAccount.companyName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Business Type</label>
                    <p className="text-lg font-semibold capitalize">{businessAccount.businessType}</p>
                  </div>
                  
                  {businessAccount.gstin && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">GSTIN</label>
                      <p className="text-lg font-semibold">{businessAccount.gstin}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Credit Limit</label>
                    <p className="text-lg font-semibold">₹{businessAccount.creditLimit?.toLocaleString() || '0'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Account Status</label>
                    <Badge className={businessAccount.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {businessAccount.isApproved ? 'Approved' : 'Pending Approval'}
                    </Badge>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/contact">
                      <Button variant="outline" className="w-full">
                        Contact Support
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full">
                      Download Account Statement
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}