'use client'

import React, { useState, useEffect } from 'react'
import SearchFunctionality from './SearchFunctionality'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

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

export default function SearchComponent() {
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('query') || ''
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm) {
        setIsLoading(true)
        setError(null)
        try {
          const fetchedUsers = await fetchUsers(searchTerm)
          setUsers(fetchedUsers)
        } catch (err) {
          setError('Failed to fetch users. Please try again.')
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
                        <div className="flex  justify-around items-center gap-4 mb-4 mt-6 text-white">
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
                          <Button className='bg-green-600 text-white'>
                            Invite
                          </Button>
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