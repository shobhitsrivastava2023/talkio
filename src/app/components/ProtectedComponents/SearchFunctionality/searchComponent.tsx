'use client'

import React, { useState, useEffect } from 'react'
import SearchFunctionality from './SearchFunctionality'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { validateRequest } from '@/lib/validate-request'

interface User {
  id: string
  username: string
  avatar: string | null
  bio: string | null
}

async function fetchUsers(searchTerm: string): Promise<User[]> {
  const response = await fetch(`/api/searchUsers?query=${encodeURIComponent(searchTerm)}`)
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  return response.json()
}

async function checkInviteStatus(senderId: string, receiverId: string): Promise<boolean> {
  const response = await fetch(`/api/sendInvite?senderId=${senderId}&receiverId=${receiverId}`);
  if (!response.ok) {
    throw new Error('Failed to check invite status');
  }
  const data = await response.json();
  return data.status === 'pending';
}


export default function SearchComponent() {
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('query') || ''
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [invitingUser, setInvitingUser] = useState<string | null>(null)
  const [invitePending, setInvitePending] = useState<{ [key: string]: boolean }>({})

  const handleInvite = async (receiverId: string) => {
    try {
      setInvitingUser(receiverId)
      const userId = await validateRequest()
      const senderId = userId.user?.id
      if (!senderId) throw new Error('User not authenticated')

      const response = await fetch('/api/sendInvite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderId, receiverId }),
      })
    
      if (response.ok) {
        console.log('Invite sent successfully')
        setInvitePending(prev => ({ ...prev, [receiverId]: true }))
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send invite')
      }
    } catch (error) {
      console.error('Error sending invite:', error)
      // You might want to show an error message to the user here
    } finally {
      setInvitingUser(null)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm) {
        setIsLoading(true)
        setError(null)
        try {
          const fetchedUsers = await fetchUsers(searchTerm)
          setUsers(fetchedUsers)

          // Check invite status for each user
          const userId = await validateRequest()
          if (userId.user?.id) {
            const statuses = await Promise.all(
              fetchedUsers.map(user => checkInviteStatus(userId.user!.id, user.id))
            )
            const newInvitePending = fetchedUsers.reduce((acc, user, index) => {
              acc[user.id] = statuses[index]
              return acc
            }, {} as { [key: string]: boolean })
            setInvitePending(newInvitePending)
          }
        } catch (err) {
          setError('Failed to fetch users or check invite statuses. Please try again.')
          setUsers([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setUsers([])
      }
    }

    fetchData()
  }, [searchTerm])

  return (
    <div className="relative w-full max-w-md mx-auto">
      <SearchFunctionality />
      {isLoading && (
        <div className="absolute top-full left-0 right-0 bg-zinc-900 p-4 rounded-lg shadow-lg z-10 mt-2">
          <p className="text-white">Loading...</p>
        </div>
      )}
      {error && (
        <div className="absolute top-full left-0 right-0 bg-zinc-900 p-4 rounded-lg shadow-lg z-10 mt-2">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      {searchTerm && !isLoading && !error && users.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-zinc-900 rounded-lg shadow-lg z-10 mt-2 max-h-96 overflow-y-auto">
          <ul className="divide-y divide-zinc-800">
            {users.map((user) => (
              <li key={user.id}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full h-full px-4 py-3 flex items-center gap-4 hover:bg-zinc-800 transition-colors">
                      <Image
                        src={user.avatar || '/placeholder.svg'}
                        alt={`${user.username}'s avatar`}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      <span className="text-sm text-white text-left flex-grow">{user.username}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='bg-zinc-900'>
                    <DialogHeader>
                      <DialogTitle>{user.username}</DialogTitle>
                      <DialogDescription>
                        <div className="flex justify-around items-center gap-4 mb-4 mt-6 text-white">
                          <Image
                            src={user.avatar || '/placeholder.svg'}
                            alt={`${user.username}'s avatar`}
                            width={60}
                            height={60}
                            className="rounded-full object-fill"
                          />
                          <div>
                            <h3 className="text-lg font-semibold">{user.username}</h3>
                            <p className="text-sm text-zinc-400">{user.bio || 'No bio available'}</p>
                          </div>
                          {invitePending[user.id] ? (
                            <span className="px-4 py-2 bg-yellow-600 text-white rounded-md">Pending</span>
                          ) : (
                            <Button 
                              className='bg-green-600 text-white hover:bg-green-700 disabled:bg-green-800'
                              onClick={() => handleInvite(user.id)}
                              disabled={invitingUser === user.id}
                            >
                              {invitingUser === user.id ? 'Inviting...' : 'Invite'}
                            </Button>
                          )}
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}