'use client'

import React, { useState, useEffect } from 'react'
import SearchFunctionality from './SearchFunctionality'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

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
    <div className="relative">
      <SearchFunctionality />
      {isLoading && (
        <div className="absolute top-full left-0 right-0 bg-zinc-900 p-4 rounded-lg shadow-lg z-10">
          <p>Loading...</p>
        </div>
      )}
      {error && (
        <div className="absolute top-full left-0 right-0 bg-zinc-900 p-4 rounded-lg shadow-lg z-10">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      {searchTerm && !isLoading && !error && users.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-zinc-900 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-zinc-800">
            <tbody className="bg-zinc-800 divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="flex flex-row justify-start items-center gap-5 hover:cursor-pointer hover:bg-slate-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <Image
                      src={user.avatar || '/placeholder.svg'}
                      alt={`${user.username}'s avatar`}
                      width={50}
                      height={50}
                      className="rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-start">
                    {user.username}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}