import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const checkoutSchema = z.object({
  shippingAddressId: z.string().min(1, 'Shipping address is required'),
  billingAddressId: z.string().min(1, 'Billing address is required'),
  paymentMethod: z.string().optional(),
  couponCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { shippingAddressId, billingAddressId, paymentMethod, couponCode } = checkoutSchema.parse(body);

    // Get cart items
    const cartItems = await db.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: true,
        variant: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Verify addresses exist and belong to user
    const [shippingAddress, billingAddress] = await Promise.all([
      db.address.findFirst({
        where: { id: shippingAddressId, userId: session.user.id },
      }),
      db.address.findFirst({
        where: { id: billingAddressId, userId: session.user.id },
      }),
    ]);

    if (!shippingAddress || !billingAddress) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => 
      sum + (Number(item.variant.priceINR) * item.quantity), 0
    );
    const tax = subtotal * 0.18; // 18% GST
    const shipping = subtotal > 1000 ? 0 : 50;
    let discount = 0;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await db.discountCode.findUnique({
        where: { code: couponCode, isActive: true },
      });

      if (coupon && new Date() >= coupon.validFrom && new Date() <= coupon.validUntil) {
        if (coupon.type === 'percentage') {
          discount = Math.min(
            (subtotal * Number(coupon.value)) / 100,
            Number(coupon.maxDiscountINR || discount)
          );
        } else {
          discount = Number(coupon.value);
        }
      }
    }

    const total = subtotal + tax + shipping - discount;

    // Generate order number
    const orderNumber = `NH${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        status: 'pending',
        paymentStatus: 'pending',
        shippingAddressId,
        billingAddressId,
        subtotalINR: subtotal,
        taxAmountINR: tax,
        shippingINR: shipping,
        discountINR: discount,
        totalINR: total,
        couponCode,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            sku: item.variant.sku,
            name: item.product.name,
            weightGrams: item.variant.weightGrams,
            quantity: item.quantity,
            priceINR: item.variant.priceINR,
            totalINR: Number(item.variant.priceINR) * item.quantity,
            giftNote: item.giftNote,
          })),
        },
      },
    });

    // Clear cart
    await db.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}