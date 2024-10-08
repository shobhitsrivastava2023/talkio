'use client'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { MdEdit } from 'react-icons/md';
import { PiNotificationLight, PiNotificationFill } from 'react-icons/pi';
import { validateRequest } from '@/lib/validate-request';

const ChatList = () => {
  const [invites, setInvites] = useState([]);  // Store received invites
  const [hasPendingInvites, setHasPendingInvites] = useState(false);  // For notification icon

  useEffect(() => {
    // Fetch pending invites
    const fetchInvites = async () => {
      const user = await validateRequest()
      const response = await fetch(`/api/getInvite?userId=${user.user?.id}`);  
      const data = await response.json();
      setInvites(data);
      setHasPendingInvites(data.length > 0);  // Set the notification status
    };

    fetchInvites();
  }, []);

  return (
    <div className='relative w-full h-full bg-zinc-800 rounded-lg p-4'>
      <h2 className='text-lg font-semibold text-white mb-4'>Your Chat</h2>

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white hover:bg-opacity-75"
          >
            {hasPendingInvites ? (
              <PiNotificationFill size={32} className=' fill-blue-500' />  // Filled notification if pending invites
            ) : (
              <PiNotificationLight size={32} className='' />  // Light notification if no pending invites
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </DialogTrigger>

        <DialogContent className='bg-zinc-900 text-white sm:max-w-[625px]'>
          <DialogHeader className="text-lg font-semibold">Invites</DialogHeader>

          <div className='space-y-4'>
            {invites.length > 0 ? (
              invites.map((invite: any) => (
                <div key={invite.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{invite.sender.username}</p>
                    <p className="text-sm text-gray-400">Invite Status: {invite.status}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MdEdit size={20} className='p-1' />
                    <span className="sr-only">Respond to invite</span>
                  </Button>
                </div>
              ))
            ) : (
              <p>No pending invites.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatList;
