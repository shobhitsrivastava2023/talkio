'use client';  // Ensure it's a client component
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from "@/components/ui/skeleton"

const AvatarComponent = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch user info
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/getAvatar', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch avatar');
        }

        const data = await response.json();
        setAvatarUrl(data.avatar || null);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return <Skeleton className="h-40 w-40 rounded-full" />
  }

  return (
    <Avatar className="h-40 w-40">
      <AvatarImage className=' object-cover'  src={avatarUrl || undefined} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export default AvatarComponent;
