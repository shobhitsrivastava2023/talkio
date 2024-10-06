import React from 'react'
import { validateRequest } from '@/lib/validate-request'
import { redirect } from "next/navigation"
import ProfilePage from '../components/ProtectedComponents/ProfilePage/ProfilePage'
import ChatPlace from '../components/ProtectedComponents/ChatPlace/ChatPlace'
import ChatList from '../components/ProtectedComponents/ChatList/ChatList'
export default async function Page() {
  const { user } = await validateRequest()

  if (!user) {
    return redirect("/loginPage")
  }

  return (
    <div className='w-full flex justify-center items-center p-2'>
      <div className='grid grid-cols-3 gap-4 w-full max-w-4xl aspect-[4/3]'>
      <div className='col-span-1 row-span-1 bg-zinc-800 rounded-lg p-4 flex items-center justify-center'>
          <ProfilePage />
        </div>
        <div className='col-span-2 row-span-3 bg-zinc-800 rounded-lg p-4 flex items-center justify-center'>
          <ChatPlace />
        </div>
      
        <div className='col-span-1 row-span-2 bg-zinc-800 rounded-lg p-4 flex items-center justify-center'>
          <ChatList />
        </div>
      </div>
    </div>
  )
}