'use client'

import React from 'react';
import ChatRoom from './chatroom';
import ChatRoomSkeleton from './ChatSkeleton';
import { useSearchParams } from 'next/navigation';

const ChatPlace = () => {
  const searchParams = useSearchParams();
  const receiverId = searchParams.get('chatWith');
  const [receiver, setReceiver] = React.useState(null);

  React.useEffect(() => {
    if (receiverId) {
      fetch(`/api/receiverDetails/${receiverId}`)
        .then((res) => res.json())
        .then((data) => setReceiver(data));
    }
  }, [receiverId]);

  return (
    
    <div className="w-full h-full ">
      {!receiverId ? (
        <div className="text-gray-400 flex justify-center items-center " >No chat selected</div>
      ) : receiver ? (
        <ChatRoom receiver={receiver} />
      ) : (
        <ChatRoomSkeleton />
      )}
    </div>
  );
};

export default ChatPlace;
