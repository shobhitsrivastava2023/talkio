import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/db'; // Ensure prisma client is properly imported

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const receivedInvites = await prisma.invite.findMany({
      where: { receiverId: userId, status: 'pending' },  // Fetch pending invites
      include: { sender: true }  // Include sender details
    });

    return NextResponse.json(receivedInvites, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invites' }, { status: 500 });
  }
}
