'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from "@/components/ui/textarea"
import { MdEdit } from "react-icons/md"
import UploadProfile from '../UploadProfile'
import { useState } from 'react'
import { validateRequest } from '@/lib/validate-request'
import { useEffect } from 'react'
export default function ProfilePage({ user }: { user: { username: string } }) {
  const [bio, setBio] = useState<String>('');
  const [placeholder, setPlaceholder] = useState<string>(''); 
  
  const handleBioChange = (e : any) => { 
    setBio(e.target.value); 
  }
  useEffect(() => {
    const fetchBio = async () => {
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
          setPlaceholder(data?.bio || '');  // Set placeholder with fetched bio
          setBio(data?.bio || '');          // Initialize bio with fetched bio
        } else {
          console.log('Failed to fetch bio');
        }
      } catch (error) {
        console.error('Error fetching bio:', error);
      }
    };
  
    fetchBio();
  }, []);
  
  

  

  const updateBio  = async () => { 
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
        console.log('Bio updated successfully');
      } else {
        console.log('Some error occurred'); 
      }
      
    } catch (error) {
      console.log(error); 
    }
  }
  
  
  return (
    <div className='h-full w-full'>
      <div className='flex flex-row w-full justify-end'>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <MdEdit size={35} className=' p-1 rounded-full' />
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
                    <MdEdit size={20} className=' p-1 rounded-full' />
                    <span className="sr-only">Edit bio</span>
                  </Button>
                </div>
                <form action="">

             
                <Textarea 
                placeholder= {placeholder}
                 className='bg-zinc-900 h-36 max-h-36 min-h-[144px]'
             
                   onChange={handleBioChange}  // Set onChange to update bio state
/>
                 <div className='mt-3'>
                  <Button variant = {'destructive'}  onClick={updateBio}  className='bg-zinc-800 px-3 py-1.5 rounded-md inline-block'>
                    Save Bio
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