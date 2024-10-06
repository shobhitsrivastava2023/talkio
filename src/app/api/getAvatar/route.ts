import { NextResponse } from 'next/server';
import { prisma } from '@/db/db';
import { validateRequest } from '@/lib/validate-request';

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userInfo = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        avatar: true,
      },
    });

    return NextResponse.json({ avatar: userInfo?.avatar });
  } catch (error) {
    console.error('Error fetching user avatar:', error);
    return NextResponse.json({ error: 'Failed to fetch user avatar' }, { status: 500 });
  }
}
