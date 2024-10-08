import { NextResponse } from 'next/server';
import { prisma } from '@/db/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive',
        }
      },
      select: {
        username: true,
        avatar: true,
        id: true,
        bio: true,
      },
      take: 10,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}