'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  quantity: number;
  giftNote?: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    origin: string;
  };
  variant: {
    id: string;
    sku: string;
    name: string;
    priceINR: number;
    mrpINR: number;
    weightGrams: number;
    stockQty: number;
    packaging: string;
  };
}

interface CartSummary {
  subtotal: number;
  totalItems: number;
  totalWeight: number;
  itemCount: number;
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    subtotal: 0,
    totalItems: 0,
    totalWeight: 0,
    itemCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/cart');
      return;
    }

    if (status === 'authenticated') {
      fetchCart();
    }
  }, [status, router]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
        setCartSummary(data.summary || {
          subtotal: 0,
          totalItems: 0,
          totalWeight: 0,
          itemCount: 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast({
        title: 'Error loading cart',
        description: 'Please refresh the page and try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;

    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      if (newQuantity === 0) {
        await removeItem(itemId);
        return;
      }

      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart data
      } else {
        const data = await response.json();
        toast({
          title: 'Failed to update quantity',
          description: data.error || 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to update quantity',
        description: 'Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart data
        toast({
          title: 'Item removed',
          description: 'Item has been removed from your cart.',
        });
      } else {
        toast({
          title: 'Failed to remove item',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to remove item',
        description: 'Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const addToWishlist = async (productId: string, variantId: string) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, variantId }),
      });

      if (response.ok) {
        toast({
          title: 'Added to wishlist',
          description: 'Item has been saved to your wishlist.',
        });
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartSummary.subtotal;
    const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over ₹1000
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const { subtotal, shipping, tax, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-8 h-8 text-emerald-600" />
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600">
                {cartSummary.itemCount} {cartSummary.itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any spices to your cart yet
              </p>
              <Link href="/products">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cartItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 flex-shrink-0">
                          <img
                            src={item.product.images[0] || '/placeholder-spice.jpg'}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg border"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.product.slug}`}>
                            <h3 className="font-semibold text-lg hover:text-emerald-600 transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 mb-1">{item.variant.name}</p>
                          <p className="text-sm text-gray-500 mb-2">Origin: {item.product.origin}</p>
                          
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-emerald-600">
                                ₹{Number(item.variant.priceINR).toFixed(2)}
                              </span>
                              {item.variant.mrpINR > item.variant.priceINR && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{Number(item.variant.mrpINR).toFixed(2)}
                                </span>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.variant.weightGrams}g
                            </Badge>
                          </div>

                          {/* Stock Status */}
                          {item.variant.stockQty <= 10 && (
                            <p className="text-sm text-amber-600 mb-2">
                              Only {item.variant.stockQty} left in stock
                            </p>
                          )}

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={updatingItems.has(item.id) || item.quantity <= 1}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={updatingItems.has(item.id) || item.quantity >= item.variant.stockQty}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addToWishlist(item.product.id, item.variant.id)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <Heart className="w-4 h-4 mr-1" />
                              Save
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              disabled={updatingItems.has(item.id)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>

                          {/* Gift Note */}
                          {item.giftNote && (
                            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm">
                              <strong>Gift Note:</strong> {item.giftNote}
                            </div>
                          )}
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-semibold text-lg">
                            ₹{(Number(item.variant.priceINR) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × ₹{Number(item.variant.priceINR).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {index < cartItems.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
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
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({cartSummary.totalItems} items)</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (GST 18%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {shipping === 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        🎉 You qualify for free shipping!
                      </p>
                    </div>
                  )}

                  {subtotal < 1000 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        Add ₹{(1000 - subtotal).toFixed(2)} more for free shipping
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Link href="/checkout">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <Link href="/products">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🔒</span>
                      <span>Secure checkout with SSL encryption</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">↩️</span>
                      <span>30-day return policy</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🌿</span>
                      <span>Fresh spices guaranteed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}