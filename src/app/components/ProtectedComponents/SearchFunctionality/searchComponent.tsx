'use client'

import React, { useState, useEffect } from 'react';
import SearchFunctionality from './SearchFunctionality';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
interface User {
  id: string;
  username: string;
  avatar: string | null;
  bio: string | null;
}

async function fetchUsers(searchTerm: string): Promise<User[]> {
  const response = await fetch(`/api/searchUsers?query=${encodeURIComponent(searchTerm)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

const SearchComponent = () => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('query') || '';
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm) {
        setIsLoading(true);
        setError(null);
        try {
          const fetchedUsers = await fetchUsers(searchTerm);
          setUsers(fetchedUsers);
        } catch (err) {
          setError('Failed to fetch users. Please try again.');
          setUsers([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUsers([]);
      }
    };

    fetchData();
  }, [searchTerm]);

  return (
    <div>
      <SearchFunctionality />
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {searchTerm && !isLoading && !error && (
        <table className="min-w-full divide-y divide-zinc-800 mt-4  z-10">
          
          <tbody className="bg-zinc-800  divide-gray-200 rounded-lg">
            {users.map((user) => (
              <tr key={user.id} className='flex flex-row justify-start items-center gap-5 '>
                 <div className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  <Image src = {user.avatar || ''} alt='use image' width={50} height={50} className='rounded-full object-cover'/>
                 
                </div>
                <div className="px-6 py-4 whitespace-nowrap text-sm text-white text-start ">
                  {user.username}
                </div>

               
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchComponent;