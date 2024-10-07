'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React, { useState } from 'react';
import { UploadButton } from '@/utils/uploadthing';
import { validateRequest } from '@/lib/validate-request';
import AvatarComponent from './ProfilePage/AvatarComponent';

import { twMerge } from 'tailwind-merge'
const UploadProfile = () => {
  const [imageurl, setimageurl] = useState<string>('');
  

  // Function to handle API call to update the user profile
  const updateUserProfile = async (imageUrl: string) => {
    try {
      const {user} = await validateRequest(); 
       // Replace this with the actual user ID
      const response = await fetch('/api/updateProfilePicture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,  // This would be dynamic in a real case
          imageUrl: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      console.log('Profile updated successfully:', data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Function called when upload is complete
  const handleUploadComplete = (res: any) => {
    if (res && res[0] && res[0].url) {
      const uploadedImageUrl = res[0].url;
      setimageurl(uploadedImageUrl);
      updateUserProfile(uploadedImageUrl); // Call API to update profile with the image URL
    }
  };

  return (
    <div className='flex flex-col justify-start items-center gap-4 text-black'>
      <AvatarComponent />
      <div>
        <UploadButton config={{cn: twMerge}}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            handleUploadComplete(res);
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
          content={{
            button({ ready }) {
              if (ready) return 'Profile Picture'
              return 'Getting ready...'
            },
            allowedContent({ ready, fileTypes, isUploading }) {
              if (!ready) return 'Checking what you can upload...'
              if (isUploading) return 'Uploading...'
              return `Supports: ${fileTypes.join(', ')}`
            }
          }}
        />
      </div>
    </div>
  );
};

export default UploadProfile;
