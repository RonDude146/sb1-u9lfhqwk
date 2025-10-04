'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  weightGrams: number;
  priceINR: number;
  mrpINR: number;
  packaging: string;
  stockQty: number;
  isActive: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  origin: string;
  category: string;
  tags: string[];
  hsnCode: string;
  gstRate: number;
  images: string[];
  isFeatured: boolean;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.slug}`);
      if (response.ok) {
        const productData = await response.json();
        setProduct(productData);
        // Set first active variant as default
        const firstActiveVariant = productData.variants.find((v: ProductVariant) => v.isActive);
        if (firstActiveVariant) {
          setSelectedVariant(firstActiveVariant);
        }
      } else if (response.status === 404) {
        router.push('/products');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast({
        title: 'Error loading product',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!selectedVariant || !product) return;

    setAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant.id,
          quantity,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Added to cart!',
          description: `${quantity} × ${product.name} (${selectedVariant.name}) added to your cart.`,
        });
      } else {
        const data = await response.json();
        toast({
          title: 'Failed to add to cart',
          description: data.error || 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to add to cart',
        description: 'Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!product) return;

    setAddingToWishlist(true);
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant?.id,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Added to wishlist!',
          description: `${product.name} has been saved to your wishlist.`,
        });
      } else {
        const data = await response.json();
        toast({
          title: 'Failed to add to wishlist',
          description: data.error || 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to add to wishlist',
        description: 'Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setAddingToWishlist(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.shortDesc,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Product link has been copied to your clipboard.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link href="/products">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const calculateSavings = () => {
    if (!selectedVariant || selectedVariant.mrpINR <= selectedVariant.priceINR) return 0;
    return selectedVariant.mrpINR - selectedVariant.priceINR;
  };

  const calculateSavingsPercentage = () => {
    if (!selectedVariant || selectedVariant.mrpINR <= selectedVariant.priceINR) return 0;
    return Math.round(((selectedVariant.mrpINR - selectedVariant.priceINR) / selectedVariant.mrpINR) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/products" className="inline-flex items-center text-emerald-600 hover:text-emerald-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg border overflow-hidden">
              <img
                src={product.images[currentImageIndex] || '/placeholder-spice.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      currentImageIndex === index ? 'border-emerald-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {product.isFeatured && (
                  <Badge className="bg-amber-600">Featured</Badge>
                )}
                <Badge variant="outline">{product.category}</Badge>
              </div>
              <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{product.shortDesc}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Origin: {product.origin}</span>
                <span>•</span>
                <span>SKU: {selectedVariant?.sku}</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              {selectedVariant && (
                <>
                  <div className="flex items-baseline space-x-3">
                    <span className="text-3xl font-bold text-emerald-600">
                      ₹{Number(selectedVariant.priceINR).toFixed(2)}
                    </span>
                    {selectedVariant.mrpINR > selectedVariant.priceINR && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          ₹{Number(selectedVariant.mrpINR).toFixed(2)}
                        </span>
                        <Badge variant="destructive">
                          {calculateSavingsPercentage()}% OFF
                        </Badge>
                      </>
                    )}
                  </div>
                  {calculateSavings() > 0 && (
                    <p className="text-sm text-green-600">
                      You save ₹{calculateSavings().toFixed(2)}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Price inclusive of all taxes
                  </p>
                </>
              )}
            </div>

            {/* Variant Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Select Size/Weight:
              </label>
              <Select
                value={selectedVariant?.id || ''}
                onValueChange={(value) => {
                  const variant = product.variants.find(v => v.id === value);
                  if (variant) {
                    setSelectedVariant(variant);
                    setQuantity(1); // Reset quantity when variant changes
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a variant" />
                </SelectTrigger>
                <SelectContent>
                  {product.variants
                    .filter(variant => variant.isActive)
                    .map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{variant.name}</span>
                          <span className="ml-4 font-medium">
                            ₹{Number(variant.priceINR).toFixed(2)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stock Status */}
            {selectedVariant && (
              <div className="space-y-2">
                {selectedVariant.stockQty > 0 ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">In Stock</span>
                    {selectedVariant.stockQty <= 10 && (
                      <span className="text-sm text-amber-600">
                        (Only {selectedVariant.stockQty} left)
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selection */}
            {selectedVariant && selectedVariant.stockQty > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Quantity:
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-10 w-10 p-0"
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 text-center min-w-[3rem]">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(selectedVariant.stockQty, quantity + 1))}
                      disabled={quantity >= selectedVariant.stockQty}
                      className="h-10 w-10 p-0"
                    >
                      +
                    </Button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Max: {selectedVariant.stockQty}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stockQty === 0 || addingToCart}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAddToWishlist}
                  disabled={addingToWishlist}
                  size="lg"
                >
                  <Heart className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  size="lg"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
              
              {session?.user.isBusinessAccount && (
                <Link href={`/b2b/quote?product=${product.id}&variant=${selectedVariant?.id}`}>
                  <Button variant="outline" className="w-full" size="lg">
                    Request B2B Quote
                  </Button>
                </Link>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Free shipping over ₹1000</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Secure payments</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                <span>30-day returns</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Quality guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                    
                    {product.tags.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-3">Tags:</h3>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Product Details</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Origin:</dt>
                          <dd className="font-medium">{product.origin}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Category:</dt>
                          <dd className="font-medium">{product.category}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">HSN Code:</dt>
                          <dd className="font-medium">{product.hsnCode}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">GST Rate:</dt>
                          <dd className="font-medium">{product.gstRate}%</dd>
                        </div>
                      </dl>
                    </div>
                    
                    {selectedVariant && (
                      <div>
                        <h3 className="font-semibold mb-3">Variant Details</h3>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Weight:</dt>
                            <dd className="font-medium">{selectedVariant.weightGrams}g</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Packaging:</dt>
                            <dd className="font-medium">{selectedVariant.packaging}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">SKU:</dt>
                            <dd className="font-medium">{selectedVariant.sku}</dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Shipping Information</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Free shipping on orders over ₹1000</li>
                        <li>• Standard delivery: 3-5 business days</li>
                        <li>• Express delivery: 1-2 business days (additional charges apply)</li>
                        <li>• International shipping available to Gulf countries</li>
                        <li>• Cash on Delivery available for orders within India</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Return Policy</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• 30-day return policy for unopened products</li>
                        <li>• Quality guarantee - return if not satisfied</li>
                        <li>• Free return shipping for defective items</li>
                        <li>• Refund processed within 5-7 business days</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600 mb-6">
                      Be the first to review this product
                    </p>
                    <Button variant="outline">
                      Write a Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}