import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createQuoteSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string(),
    quantity: z.number().min(1),
  })),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.isBusinessAccount) {
      return NextResponse.json({ error: 'Business account required' }, { status: 403 });
    }

    const businessAccount = await db.businessAccount.findUnique({
      where: { userId: session.user.id },
    });

    if (!businessAccount) {
      return NextResponse.json({ error: 'Business account not found' }, { status: 404 });
    }

    const quotes = await db.quote.findMany({
      where: { businessAccountId: businessAccount.id },
      include: {
        items: {
          include: {
            product: {
              select: { name: true },
            },
            variant: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error('B2B quotes GET error:', error);
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

    if (!session.user.isBusinessAccount) {
      return NextResponse.json({ error: 'Business account required' }, { status: 403 });
    }

    const businessAccount = await db.businessAccount.findUnique({
      where: { userId: session.user.id },
    });

    if (!businessAccount) {
      return NextResponse.json({ error: 'Business account not found' }, { status: 404 });
    }

    const body = await request.json();
    const { items, notes } = createQuoteSchema.parse(body);

    // Verify all products and variants exist
    for (const item of items) {
      const variant = await db.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant || variant.productId !== item.productId) {
        return NextResponse.json(
          { error: `Invalid product or variant: ${item.productId}` },
          { status: 400 }
        );
      }
    }

    // Create quote
    const quote = await db.quote.create({
      data: {
        businessAccountId: businessAccount.id,
        notes,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            priceINR: 0, // Will be filled by admin
            totalINR: 0, // Will be filled by admin
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { name: true },
            },
            variant: {
              select: { name: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ quote }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('B2B quote creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}