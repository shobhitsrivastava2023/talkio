
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { validateRequest } from '@/lib/validate-request';
import React from 'react'
import { MdEdit } from "react-icons/md";
import { useState } from 'react';
import { UploadButton } from '@/utils/uploadthing';
import UploadProfile from '../UploadProfile';
const ProfilePage = async  () => {
  
  const {user} = await validateRequest();
  return (
    <div className='h-full w-full'>
      <div className='flex flex-row w-full justify-end'>
        <Dialog>
          <DialogTrigger asChild>
            
            <Button>
            <MdEdit size={35} className='hover:cursor-pointer hover:bg-zinc-900 p-1 rounded-full'/>
            </Button>
          </DialogTrigger>
            <DialogContent className='bg-zinc-900 text-white'>
              <DialogHeader > Hello {user?.username}</DialogHeader>
              
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <div className='flex flex-row justify-start items-center'>
              <h1>Bio </h1>
              <Button>
            <MdEdit size={25} className='hover:cursor-pointer hover:bg-neutral-800 p-1 rounded-full'/>
            </Button>

                </div>     
              
              <div className='text-sm text-zinc-500  h-36 '>
                this is your bio here.
              </div>
              <div>
                <Label className='  bg-zinc-800  mt-10 h-7 w-20 p-2 rounded-md'>Connections </Label>
              </div>
            </div>

          <UploadProfile/>
        
          </div>
            </DialogContent>
     
        </Dialog>


      </div>
    
    </div>
  )
}

export default ProfilePage
