'use client'

import { validateRequest } from '@/lib/validate-request'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, User, Loader2 } from 'lucide-react'

interface User {
  id: string
  username: string
  avatar: string
}

interface Invite {
  id: string
  sender: User
  status: 'accepted'
}

export default function ChatListDialog() {
  const [acceptedInvites, setAcceptedInvites] = useState<Invite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAcceptedInvites = async () => {
      try {
        setIsLoading(true)
        const userId = await validateRequest()
        const response = await fetch(`/api/getInviteResponse?userId=${userId.user?.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch accepted invites')
        }
        const data: Invite[] = await response.json()
        setAcceptedInvites(data)
      } catch (error) {
        console.error('Error fetching accepted invites:', error)
        setError('Failed to load chats. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAcceptedInvites()
  }, [])

  if (isLoading) {
    return (
      <div className="flex bg-slate-400 rounded-xl justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className=" text-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Chats</h2>
      {acceptedInvites.length > 0 ? (
        <ScrollArea className="h-[300px] pr-4">
          <ul className="space-y-4">
            {acceptedInvites.map((invite) => (
              <li key={invite.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/75 transition-colors">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={invite.sender.avatar} alt={invite.sender.username} className='object-cover'/>
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{invite.sender.username}</span>
                </div>
                <Button variant="ghost" size="icon" className="text-white hover:text-primary-foreground hover:bg-primary">
                  <MessageCircle className="h-5 w-5" />
                  <span className="sr-only">Chat with {invite.sender.username}</span>
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      ) : (
        <p className="text-center text-muted-foreground py-8">No active chats. Start a conversation!</p>
      )}
    </div>
  )
}