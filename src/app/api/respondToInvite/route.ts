import { NextResponse } from 'next/server'
import { prisma } from '@/db/db'



export async function POST(req: Request) {
  try {
    const { inviteId, action } = await req.json()

    if (!inviteId || !action) {
      return NextResponse.json({ error: 'Missing inviteId or action' }, { status: 400 })
    }

    if (action !== 'accept' && action !== 'reject') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const updatedInvite = await prisma.invite.update({
      where: { id: inviteId },
      data: { status: action === 'accept' ? 'accepted' : 'rejected' },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json({ invite: updatedInvite }, { status: 200 })
  } catch (error) {
    console.error('Error updating invite:', error)
    return NextResponse.json({ error: 'Failed to update invite' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}