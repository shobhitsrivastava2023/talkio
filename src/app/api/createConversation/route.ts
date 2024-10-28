import { NextResponse } from 'next/server'
import { prisma } from '@/db/db'
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, receiverId } = body

  
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            OR: [
              { senderId: userId, recieverId: receiverId },
              { senderId: receiverId, recieverId: userId }
            ]
          },
          { isGroup: false }
        ]
      }
    })

    if (existingConversation) {
      return NextResponse.json(existingConversation)
    }

   
    const newConversation = await prisma.conversation.create({
      data: {
        senderId: userId,
        recieverId: receiverId,
        users: {
          connect: [
            { id: userId },
            { id: receiverId }
          ]
        },
      },
      include: {
        users: true,
      },
    })

  
    await pusher.trigger('chat', 'conversation:new', {
      conversation: newConversation,
      userIds: [userId, receiverId],
    })

    return NextResponse.json(newConversation)
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}