'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CreditCard, MapPin, Truck, Shield, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

interface CartItem {
  id: string;
  product: {
    name: string;
    images: string[];
  };
  variant: {
    name: string;
    priceINR: number;
    weightGrams: number;
  };
  quantity: number;
  giftNote?: string;
}

interface Address {
  id: string;
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

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<string>('');
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<string>('');
  const [billingIsSameAsShipping, setBillingIsSameAsShipping] = useState(true);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'IN',
    phone: '',
  });

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/checkout');
      return;
    }

    if (status === 'authenticated') {
      fetchCheckoutData();
    }
  }, [status, router]);

  const fetchCheckoutData = async () => {
    try {
      const [cartResponse, addressResponse] = await Promise.all([
        fetch('/api/cart'),
        fetch('/api/addresses')
      ]);

      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        setCartItems(cartData.items || []);
      }

      if (addressResponse.ok) {
        const addressData = await addressResponse.json();
        setAddresses(addressData.addresses || []);
        
        // Set default addresses
        const defaultShipping = addressData.addresses.find((addr: Address) => addr.type === 'shipping');
        const defaultBilling = addressData.addresses.find((addr: Address) => addr.type === 'billing');
        
        if (defaultShipping) setSelectedShippingAddress(defaultShipping.id);
        if (defaultBilling) setSelectedBillingAddress(defaultBilling.id);
      }
    } catch (error) {
      console.error('Failed to fetch checkout data:', error);
      setError('Failed to load checkout data');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => 
      sum + (Number(item.variant.priceINR) * item.quantity), 0
    );
    const tax = subtotal * 0.18; // 18% GST
    const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over ₹1000
    const total = subtotal + tax + shipping;

    return { subtotal, tax, shipping, total };
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress),
      });

      if (response.ok) {
        const address = await response.json();
        setAddresses(prev => [...prev, address]);
        setSelectedShippingAddress(address.id);
        setShowNewAddressForm(false);
        setNewAddress({
          firstName: '',
          lastName: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'IN',
          phone: '',
        });
      }
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  const handleCheckout = async () => {
    if (!selectedShippingAddress) {
      setError('Please select a shipping address');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddressId: selectedShippingAddress,
          billingAddressId: billingIsSameAsShipping ? selectedShippingAddress : selectedBillingAddress,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to payment or success page
        router.push(`/orders/${data.orderId}/payment`);
      } else {
        setError(data.error || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <Link href="/products">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { subtotal, tax, shipping, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-start space-x-3">
                        <input
                          type="radio"
                          id={`shipping-${address.id}`}
                          name="shippingAddress"
                          value={address.id}
                          checked={selectedShippingAddress === address.id}
                          onChange={(e) => setSelectedShippingAddress(e.target.value)}
                          className="mt-1"
                        />
                        <label htmlFor={`shipping-${address.id}`} className="flex-1 cursor-pointer">
                          <div className="p-3 border rounded-lg hover:bg-gray-50">
                            <p className="font-medium">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.addressLine1}
                              {address.addressLine2 && `, ${address.addressLine2}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            {address.phone && (
                              <p className="text-sm text-gray-600">{address.phone}</p>
                            )}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : null}

                <Button
                  variant="outline"
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="w-full"
                >
                  Add New Address
                </Button>

                {showNewAddressForm && (
                  <form onSubmit={handleAddressSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={newAddress.firstName}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={newAddress.lastName}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="addressLine1">Address Line 1</Label>
                      <Input
                        id="addressLine1"
                        value={newAddress.addressLine1}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                      <Input
                        id="addressLine2"
                        value={newAddress.addressLine2}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine2: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button type="submit" size="sm">Save Address</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setShowNewAddressForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
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
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="billingIsSame"
                    checked={billingIsSameAsShipping}
                    onCheckedChange={setBillingIsSameAsShipping}
                  />
                  <Label htmlFor="billingIsSame">Same as shipping address</Label>
                </div>

                {!billingIsSameAsShipping && (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-start space-x-3">
                        <input
                          type="radio"
                          id={`billing-${address.id}`}
                          name="billingAddress"
                          value={address.id}
                          checked={selectedBillingAddress === address.id}
                          onChange={(e) => setSelectedBillingAddress(e.target.value)}
                          className="mt-1"
                        />
                        <label htmlFor={`billing-${address.id}`} className="flex-1 cursor-pointer">
                          <div className="p-3 border rounded-lg hover:bg-gray-50">
                            <p className="font-medium">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.addressLine1}
                              {address.addressLine2 && `, ${address.addressLine2}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Standard Shipping</p>
                      <p className="text-sm text-gray-600">5-7 business days</p>
                    </div>
                    <p className="font-medium">
                      {shipping === 0 ? 'Free' : `₹${shipping}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex space-x-3">
                      <img
                        src={item.product.images[0] || '/placeholder-spice.jpg'}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-600">{item.variant.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">
                        ₹{(Number(item.variant.priceINR) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <Shield className="w-4 h-4" />
                  <span>Secure checkout with SSL encryption</span>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={processing || !selectedShippingAddress}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {processing ? 'Processing...' : `Place Order - ₹${total.toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}