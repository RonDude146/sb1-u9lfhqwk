import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

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

    return NextResponse.json({ account: businessAccount });
  } catch (error) {
    console.error('B2B account GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}