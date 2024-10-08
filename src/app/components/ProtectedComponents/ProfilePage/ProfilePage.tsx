'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { MdEdit } from "react-icons/md"
import UploadProfile from '../UploadProfile'
import { useState, useEffect } from 'react'
import { validateRequest } from '@/lib/validate-request'

export default function ProfilePage({ user }: { user: { username: string } }) {
  const [bio, setBio] = useState<string>('');
  const [bioforApi, setBioforApi] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [placeholder, setPlaceholder] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  }

  useEffect(() => {
    const fetchBio = async () => {
      setIsLoading(true);
      const userData = await validateRequest();
      try {
        const userId = userData.user?.id;

        if (!userId) {
          console.log('User ID not found');
          return;
        }

        const response = await fetch(`/api/SaveBio?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
         
          setPlaceholder(data?.bio || '');
          setAvatar(data?.avatar || '');
        } else {
          console.log('Failed to fetch bio');
        }
      } catch (error) {
        console.error('Error fetching bio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBio();
  }, []);

  const updateBio = async () => {
    const userData = await validateRequest();
    try {
      const userId = userData.user?.id;
      const response = await fetch('/api/SaveBio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          bio: bio
        }),
      });

      if (response.ok) {
       setBioforApi(bio)
      } else {
        console.log('Some error occurred');
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='h-full w-full relative'>
      {isLoading ? (
        <Skeleton className="w-full h-full" />
      ) : avatar ? (
        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
          No Avatar
        </div>
      )}
      <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent'></div>
      <div className='absolute bottom-0 left-0 right-0 p-4'>
        <h2 className="text-xl font-bold text-white">{user?.username}</h2>
        <p className="text-sm text-gray-300 mt-1 line-clamp-2">{bioforApi || placeholder}</p>
      </div>
      <div className='absolute top-2 right-2'>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-black bg-opacity-50 text-white hover:bg-opacity-75">
              <MdEdit size={24} className='p-1' />
              <span className="sr-only">Edit profile</span>
            </Button>
          </DialogTrigger>
          <DialogContent className='bg-zinc-900 text-white sm:max-w-[625px]'>
            <DialogHeader className="text-lg font-semibold">Hello {user?.username}</DialogHeader>
            <div className='grid grid-cols-2 gap-6'>
              <div className="space-y-4">
                <div className='flex items-center justify-between'>
                  <h2 className="text-lg font-semibold">Bio</h2>
                  <Button variant="ghost" size="icon">
                    <MdEdit size={20} className='p-1' />
                    <span className="sr-only">Edit bio</span>
                  </Button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); updateBio(); }}>
                  <Textarea 
                    placeholder={placeholder}
                    className='bg-zinc-900 h-36 max-h-36 min-h-[144px]'
                    value={bio}
                    onChange={handleBioChange}
                  />
                  <div className='mt-3'>
                    <Button type="submit" variant='destructive' className='bg-zinc-800 px-3 py-1.5 rounded-md inline-block'>
                     Save Profile 
                    </Button>
                  </div>
                </form>
              </div>
              <UploadProfile />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}