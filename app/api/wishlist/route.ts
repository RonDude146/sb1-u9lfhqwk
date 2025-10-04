import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const addToWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wishlistItems = await db.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
            origin: true,
            isFeatured: true,
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            priceINR: true,
            mrpINR: true,
            stockQty: true,
            weightGrams: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ items: wishlistItems });
  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, variantId } = addToWishlistSchema.parse(body);

    // Check if item already exists in wishlist
    const existingItem = await db.wishlistItem.findUnique({
      where: {
        userId_productId_variantId: {
          userId: session.user.id,
          productId,
          variantId: variantId || null,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { message: 'Item already in wishlist' },
        { status: 200 }
      );
    }

    // Verify product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Verify variant exists if provided
    if (variantId) {
      const variant = await db.productVariant.findUnique({
        where: { id: variantId },
      });

      if (!variant || variant.productId !== productId) {
        return NextResponse.json(
          { error: 'Variant not found' },
          { status: 404 }
        );
      }
    }

    const wishlistItem = await db.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
        variantId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
            origin: true,
            isFeatured: true,
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            priceINR: true,
            mrpINR: true,
            stockQty: true,
            weightGrams: true,
          },
        },
      },
    });

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Add to wishlist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}