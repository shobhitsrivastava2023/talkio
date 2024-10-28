import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucide-react';

const ChatRoomSkeleton = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Chat Header Skeleton */}
      <div className="flex items-center space-x-3 p-4 border-b border-zinc-700">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-1/4 h-6" />
      </div>

      {/* Messages Area Skeleton */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Multiple skeleton messages for loading effect */}
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex justify-start">
            <Skeleton className="max-w-[70%] rounded-lg p-3 bg-zinc-700 h-10 w-1/2" />
          </div>
        ))}
      </div>

      {/* Message Input Skeleton */}
      <div className="p-4 border-t border-zinc-700 flex space-x-2">
        <Skeleton className="flex-1 h-10 bg-zinc-700" />
        <Skeleton className="w-10 h-10 bg-blue-600" />
      </div>
    </div>
  );
};

export default ChatRoomSkeleton;
