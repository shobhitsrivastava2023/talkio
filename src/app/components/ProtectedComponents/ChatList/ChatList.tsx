'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { CheckCircle, XCircle, Bell, BellRing, Edit, User } from 'lucide-react'
import { validateRequest } from '@/lib/validate-request'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

interface User {
  id: string
  username: string
  avatar: string
}

interface Invite {
  id: string
  sender: User
  status: 'pending' | 'accepted' | 'rejected'
}

export default function ChatList() {
  const [invites, setInvites] = useState<Invite[]>([])
  const [hasPendingInvites, setHasPendingInvites] = useState(false)
  const [avatarsLoaded, setAvatarsLoaded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const user = await validateRequest()
        if (!user.user?.id) {
          console.error('User not found')
          return
        }
        const response = await fetch(`/api/getInvite?userId=${user.user.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch invites')
        }
        const data: Invite[] = await response.json()
        setInvites(data)
        setHasPendingInvites(data.some(invite => invite.status === 'pending'))
      } catch (error) {
        console.error('Error fetching invites:', error)
      }
    }

    fetchInvites()
  }, [])

  const handleInviteResponse = async (inviteId: string, action: 'accept' | 'reject') => {
    try {
      const response = await fetch('/api/respondToInvite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inviteId, action }),
      })

      if (!response.ok) {
        throw new Error('Failed to update invite')
      }

      setInvites(prevInvites =>
        prevInvites.map(invite =>
          invite.id === inviteId ? { ...invite, status: action === 'accept' ? 'accepted' : 'rejected' } : invite
        )
      )

      setHasPendingInvites(prevState => {
        const stillHasPending = invites.some(invite => invite.id !== inviteId && invite.status === 'pending')
        return stillHasPending
      })
    } catch (error) {
      console.error(`Error ${action}ing invite:`, error)
    }
  }

  const handleAvatarLoad = (inviteId: string) => {
    setAvatarsLoaded(prev => ({ ...prev, [inviteId]: true }))
  }

  return (
    <div className="relative w-full h-full bg-zinc-800 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-white mb-4">Your Chats</h2>

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white hover:bg-opacity-75"
          >
            {hasPendingInvites ? (
              <BellRing className="h-6 w-6 text-blue-500" />
            ) : (
              <Bell className="h-6 w-6" />
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-zinc-900 text-white sm:max-w-[625px]">
          <DialogHeader className="text-lg font-semibold">Invites</DialogHeader>

          <div className="space-y-4">
            {invites.length > 0 ? (
              invites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {!avatarsLoaded[invite.id] && (
                      <Skeleton className="w-10 h-10 rounded-full" />
                    )}
                    <Avatar className={avatarsLoaded[invite.id] ? 'block' : 'hidden'}>
                      <AvatarImage 
                        src={invite.sender.avatar} 
                        alt={`${invite.sender.username}'s avatar`} 
                        onLoad={() => handleAvatarLoad(invite.id)}
                        className='object-cover'
                      />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{invite.sender.username}</p>
                      <p className="text-sm text-gray-400">Invite Status: {invite.status}</p>
                    </div>
                  </div>
                  {invite.status === 'pending' ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-500 hover:text-white hover:bg-green-500"
                        onClick={() => handleInviteResponse(invite.id, 'accept')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-white hover:bg-red-500"
                        onClick={() => handleInviteResponse(invite.id, 'reject')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit invite</span>
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p>No pending invites.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}