import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  limit: z.number().optional().default(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit } = searchSchema.parse(body);

    // Search products by name, description, tags
    const products = await db.product.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { shortDesc: { contains: query, mode: 'insensitive' } },
              { tags: { hasSome: [query] } },
              { category: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { priceINR: 'asc' },
          take: 1,
        },
      },
      take: limit,
      orderBy: [
        { isFeatured: 'desc' },
        { name: 'asc' },
      ],
    });

    // Generate search suggestions
    const suggestions = await db.product.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { name: { startsWith: query, mode: 'insensitive' } },
              { tags: { hasSome: [query] } },
            ],
          },
        ],
      },
      select: {
        name: true,
        slug: true,
      },
      take: 5,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      products,
      suggestions: suggestions.map(p => ({
        name: p.name,
        slug: p.slug,
      })),
      query,
      total: products.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}