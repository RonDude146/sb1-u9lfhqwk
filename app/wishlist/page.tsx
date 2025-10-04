'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    origin: string;
    isFeatured: boolean;
  };
  variant?: {
    id: string;
    name: string;
    priceINR: number;
    mrpINR: number;
    stockQty: number;
    weightGrams: number;
  };
  createdAt: string;
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/wishlist');
      return;
    }

    if (status === 'authenticated') {
      fetchWishlist();
    }
  }, [status, router]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    
    try {
      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId));
        toast({ title: 'Removed from wishlist' });
      } else {
        toast({ title: 'Failed to remove item', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Failed to remove item', variant: 'destructive' });
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleAddToCart = async (productId: string, variantId?: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          variantId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        toast({ title: 'Added to cart successfully' });
      } else {
        toast({ title: 'Failed to add to cart', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Failed to add to cart', variant: 'destructive' });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

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
            <Heart className="w-8 h-8 text-emerald-600" />
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">
                Save items you love to buy them later
              </p>
              <Link href="/products">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <img
                      src={item.product.images[0] || '/placeholder-spice.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.product.isFeatured && (
                      <Badge className="absolute top-2 left-2 bg-amber-600">
                        Featured
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      disabled={removingItems.has(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="p-4">
                    <Link href={`/products/${item.product.slug}`}>
                      <h3 className="font-semibold text-lg mb-1 hover:text-emerald-600 transition-colors line-clamp-2">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{item.product.origin}</p>
                    
                    {item.variant && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">{item.variant.name}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-emerald-600">
                            ₹{item.variant.priceINR}
                          </span>
                          {item.variant.mrpINR > item.variant.priceINR && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.variant.mrpINR}
                            </span>
                          )}
                        </div>
                        {item.variant.stockQty <= 0 && (
                          <Badge variant="secondary" className="mt-1">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleAddToCart(item.product.id, item.variant?.id)}
                        disabled={item.variant?.stockQty === 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Link href={`/products/${item.product.slug}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {wishlistItems.length > 0 && (
          <div className="mt-8 text-center">
            <Link href="/products">
              <Button variant="outline" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}