import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  origin: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.roles?.some(role => role.name === 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const product = await db.product.findUnique({
      where: { id: params.productId },
      include: {
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Admin product GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.roles?.some(role => role.name === 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);

    const product = await db.product.update({
      where: { id: params.productId },
      data: validatedData,
      include: {
        variants: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Admin product PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user.roles?.some(role => role.name === 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if product has any orders
    const orderCount = await db.orderItem.count({
      where: { productId: params.productId },
    });

    if (orderCount > 0) {
      // Don't delete, just deactivate
      await db.product.update({
        where: { id: params.productId },
        data: { isActive: false },
      });
      
      return NextResponse.json({ 
        message: 'Product deactivated (has existing orders)' 
      });
    }

    // Safe to delete
    await db.product.delete({
      where: { id: params.productId },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Admin product DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}