import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().min(1, 'Variant ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  giftNote: z.string().optional(),
});

const updateCartSchema = z.object({
  quantity: z.number().min(0, 'Quantity must be non-negative'),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItems = await db.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
            origin: true,
          },
        },
        variant: {
          select: {
            id: true,
            sku: true,
            name: true,
            priceINR: true,
            mrpINR: true,
            weightGrams: true,
            stockQty: true,
            packaging: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => 
      sum + (Number(item.variant.priceINR) * item.quantity), 0
    );
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalWeight = cartItems.reduce((sum, item) => 
      sum + (item.variant.weightGrams * item.quantity), 0
    );

    return NextResponse.json({
      items: cartItems,
      summary: {
        subtotal,
        totalItems,
        totalWeight,
        itemCount: cartItems.length,
      },
    });
  } catch (error) {
    console.error('Cart GET error:', error);
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
    const { productId, variantId, quantity, giftNote } = addToCartSchema.parse(body);

    // Verify product and variant exist
    const variant = await db.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: {
          select: {
            id: true,
            isActive: true,
          },
        },
      },
    });

    if (!variant || !variant.product.isActive || !variant.isActive) {
      return NextResponse.json(
        { error: 'Product or variant not found' },
        { status: 404 }
      );
    }

    if (variant.product.id !== productId) {
      return NextResponse.json(
        { error: 'Variant does not belong to the specified product' },
        { status: 400 }
      );
    }

    // Check stock availability
    if (variant.stockQty < quantity) {
      return NextResponse.json(
        { error: `Only ${variant.stockQty} items available in stock` },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingCartItem = await db.cartItem.findUnique({
      where: {
        userId_variantId: {
          userId: session.user.id,
          variantId,
        },
      },
    });

    let cartItem;

    if (existingCartItem) {
      // Update existing cart item
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (newQuantity > variant.stockQty) {
        return NextResponse.json(
          { error: `Cannot add ${quantity} more items. Only ${variant.stockQty - existingCartItem.quantity} more available.` },
          { status: 400 }
        );
      }

      cartItem = await db.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: newQuantity,
          giftNote: giftNote || existingCartItem.giftNote,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
            },
          },
          variant: {
            select: {
              id: true,
              sku: true,
              name: true,
              priceINR: true,
              mrpINR: true,
              weightGrams: true,
              stockQty: true,
            },
          },
        },
      });
    } else {
      // Create new cart item
      cartItem = await db.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          variantId,
          quantity,
          giftNote,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
            },
          },
          variant: {
            select: {
              id: true,
              sku: true,
              name: true,
              priceINR: true,
              mrpINR: true,
              weightGrams: true,
              stockQty: true,
            },
          },
        },
      });
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clear entire cart
    await db.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}