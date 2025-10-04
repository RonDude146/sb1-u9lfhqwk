import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const b2bSignupSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  businessType: z.string().min(1, 'Business type is required'),
  gstin: z.string().optional(),
  contactPerson: z.string().min(1, 'Contact person is required'),
  designation: z.string().min(1, 'Designation is required'),
  businessAddress: z.string().min(1, 'Business address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Valid email is required'),
  website: z.string().optional(),
  businessDescription: z.string().min(1, 'Business description is required'),
  expectedMonthlyVolume: z.string().optional(),
  currentSuppliers: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already has a business account
    const existingAccount = await db.businessAccount.findUnique({
      where: { userId: session.user.id },
    });

    if (existingAccount) {
      return NextResponse.json(
        { error: 'Business account already exists' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = b2bSignupSchema.parse(body);

    // Create business account
    const businessAccount = await db.businessAccount.create({
      data: {
        userId: session.user.id,
        companyName: validatedData.companyName,
        businessType: validatedData.businessType,
        gstin: validatedData.gstin,
        isApproved: false, // Requires admin approval
        creditLimit: 0, // Will be set by admin
      },
    });

    // Store additional application data (you might want a separate table for this)
    // For now, we'll store it in the notes or create a separate ApplicationData table

    return NextResponse.json(
      { 
        message: 'Business account application submitted successfully',
        accountId: businessAccount.id 
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('B2B signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}