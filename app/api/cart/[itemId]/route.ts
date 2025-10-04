import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateCartItemSchema = z.object({
  quantity: z.number().min(0, 'Quantity must be non-negative'),
  giftNote: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = params;
    const body = await request.json();
    const { quantity, giftNote } = updateCartItemSchema.parse(body);

    // Find the cart item
    const cartItem = await db.cartItem.findUnique({
      where: { id: itemId },
      include: {
        variant: {
          select: {
            stockQty: true,
          },
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (cartItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // If quantity is 0, delete the item
    if (quantity === 0) {
      await db.cartItem.delete({
        where: { id: itemId },
      });
      return NextResponse.json({ message: 'Item removed from cart' });
    }

    // Check stock availability
    if (quantity > cartItem.variant.stockQty) {
      return NextResponse.json(
        { error: `Only ${cartItem.variant.stockQty} items available in stock` },
        { status: 400 }
      );
    }

    // Update the cart item
    const updatedCartItem = await db.cartItem.update({
      where: { id: itemId },
      data: {
        quantity,
        ...(giftNote !== undefined && { giftNote }),
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

    return NextResponse.json(updatedCartItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Update cart item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = params;

    // Find and verify the cart item
    const cartItem = await db.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    if (cartItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete the cart item
    await db.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Delete cart item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}