import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sort') ?? 'name';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
      ];
    }

    // Price filtering will be done on variants
    const products = await db.product.findMany({
      where,
      include: {
        variants: {
          where: {
            isActive: true,
            ...(minPrice && { priceINR: { gte: parseFloat(minPrice) } }),
            ...(maxPrice && { priceINR: { lte: parseFloat(maxPrice) } }),
          },
          orderBy: { priceINR: 'asc' },
        },
      },
      orderBy: sortBy === 'price' ? undefined : { [sortBy]: 'asc' },
      skip,
      take: limit,
    });

    // Filter products that have at least one variant matching price criteria
    const filteredProducts = products.filter(product => product.variants.length > 0);

    // Sort by price if requested
    if (sortBy === 'price') {
      filteredProducts.sort((a, b) => {
        const aMinPrice = Math.min(...a.variants.map(v => Number(v.priceINR)));
        const bMinPrice = Math.min(...b.variants.map(v => Number(v.priceINR)));
        return aMinPrice - bMinPrice;
      });
    }

    const total = await db.product.count({ where });

    return NextResponse.json({
      products: filteredProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}