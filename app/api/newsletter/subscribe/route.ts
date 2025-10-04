import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    // Check if email already exists
    const existingSubscription = await db.newsletterSubscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json(
          { message: 'Email is already subscribed' },
          { status: 200 }
        );
      } else {
        // Reactivate subscription
        await db.newsletterSubscription.update({
          where: { email },
          data: { isActive: true, updatedAt: new Date() },
        });
      }
    } else {
      // Create new subscription
      await db.newsletterSubscription.create({
        data: { email, isActive: true },
      });
    }

    // In production, you would:
    // 1. Send welcome email
    // 2. Add to email marketing platform (Mailchimp, SendGrid, etc.)
    // 3. Log analytics event

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await db.newsletterSubscription.updateMany({
      where: { email },
      data: { isActive: false, updatedAt: new Date() },
    });

    return NextResponse.json(
      { message: 'Successfully unsubscribed from newsletter' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}