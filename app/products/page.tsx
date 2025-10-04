'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Grid2x2 as Grid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  origin: string;
  category: string;
  tags: string[];
  images: string[];
  isFeatured: boolean;
  variants: Array<{
    id: string;
    sku: string;
    name: string;
    weightGrams: number;
    priceINR: number;
    mrpINR: number;
    packaging: string;
    stockQty: number;
  }>;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const categories = [
  'All Categories',
  'Whole Spices',
  'Ground Spices',
  'Organic',
  'Premium',
  'Gift Packs',
];

const sortOptions = [
  { value: 'name', label: 'Name A-Z' },
  { value: 'price', label: 'Price Low to High' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: 0,
    maxPrice: 5000,
    inStock: false,
    organic: false,
  });
  const [sortBy, setSortBy] = useState('name');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sort: sortBy,
      });

      if (filters.category && filters.category !== 'All Categories') {
        params.append('category', filters.category.toLowerCase().replace(' ', '-'));
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.minPrice > 0) {
        params.append('minPrice', filters.minPrice.toString());
      }
      if (filters.maxPrice < 5000) {
        params.append('maxPrice', filters.maxPrice.toString());
      }

      const response = await fetch(`/api/products?${params}`);
      const data: ProductsResponse = await response.json();
      
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, sortBy, filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const minPrice = Math.min(...product.variants.map(v => v.priceINR));
    const maxPrice = Math.max(...product.variants.map(v => v.priceINR));
    const inStock = product.variants.some(v => v.stockQty > 0);

    if (viewMode === 'list') {
      return (
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex space-x-6">
              <div className="w-32 h-32 flex-shrink-0">
                <img
                  src={product.images[0] || '/placeholder-spice.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-600">
                      ₹{minPrice}{maxPrice > minPrice && ` - ₹${maxPrice}`}
                    </div>
                    {!inStock && <Badge variant="secondary">Out of Stock</Badge>}
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{product.shortDesc}</p>
                <p className="text-sm text-gray-500 mb-3">Origin: {product.origin}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link href={`/products/${product.slug}`}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="group hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <img
              src={product.images[0] || '/placeholder-spice.jpg'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.isFeatured && (
              <Badge className="absolute top-2 left-2 bg-amber-600">
                Featured
              </Badge>
            )}
            {!inStock && (
              <Badge variant="secondary" className="absolute top-2 right-2">
                Out of Stock
              </Badge>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.origin}</p>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-lg font-bold text-emerald-600">
                  ₹{minPrice}
                </span>
                {maxPrice > minPrice && (
                  <span className="text-sm text-gray-500 ml-1">
                    - ₹{maxPrice}
                  </span>
                )}
              </div>
              <Link href={`/products/${product.slug}`}>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  View
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-3 block">Category</Label>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={filters.category === category || (category === 'All Categories' && !filters.category)}
                onCheckedChange={() => handleFilterChange('category', category === 'All Categories' ? '' : category)}
              />
              <Label htmlFor={category} className="text-sm">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Price Range</Label>
        <div className="space-y-4">
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) => {
              handleFilterChange('minPrice', min);
              handleFilterChange('maxPrice', max);
            }}
            max={5000}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{filters.minPrice}</span>
            <span>₹{filters.maxPrice}</span>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Filters</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
            />
            <Label htmlFor="inStock" className="text-sm">In Stock Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="organic"
              checked={filters.organic}
              onCheckedChange={(checked) => handleFilterChange('organic', checked)}
            />
            <Label htmlFor="organic" className="text-sm">Organic Certified</Label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">
          Premium Spices Collection
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Discover our carefully curated selection of premium spices, sourced directly 
          from Kerala's finest estates and delivered fresh to your doorstep.
        </p>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4">Filters</h2>
            <FilterSidebar />
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Search */}
              <div className="flex-1 sm:w-64">
                <Input
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {products.length} of {pagination.total} products
            </p>
          </div>

          {/* Products Grid/List */}
          {loading ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="aspect-square w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setFilters({
                    category: '',
                    search: '',
                    minPrice: 0,
                    maxPrice: 5000,
                    inStock: false,
                    organic: false,
                  });
                  setSortBy('name');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                {[...Array(pagination.pages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={pagination.page === i + 1 ? 'default' : 'outline'}
                    onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}