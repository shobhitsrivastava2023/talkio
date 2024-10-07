'use client'

import { Input } from '@/components/ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const SearchFunctionality = () => {
  const searchParams = useSearchParams(); 
  const pathname = usePathname(); 
  const {replace} = useRouter(); 
  function handleSearch(term: string) { 
    const params = new URLSearchParams(searchParams); 
    if(term){ 
      params.set('query', term)
    }else{
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className=''>
     <Input  
     className="bg-zinc-900 border-0 
     border-b-2 border-zinc-900 px-6 py-8 focus-visible:ring-offset-0 
     focus-visible:ring-0 rounded-full" 
     placeholder="Search For Users" 

     onChange={(e) => handleSearch(e.target.value)}
     defaultValue={searchParams.get('query')?.toString()}
     
     />
    </div>
  )
}

export default SearchFunctionality
