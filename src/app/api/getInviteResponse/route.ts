import { NextResponse } from 'next/server';
import { prisma } from '@/db/db'; 
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const acceptedInvites = await prisma.invite.findMany({
      where: {
        receiverId: userId,
        status: 'accepted',
      },
      include: {
        sender: true, // Include sender details if needed
      },
    });

    return NextResponse.json(acceptedInvites, { status: 200 });
  } catch (error) {
    console.error('Error fetching accepted invites:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
