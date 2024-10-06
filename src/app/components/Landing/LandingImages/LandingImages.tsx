'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Router from 'next/navigation'
import { useRouter } from 'next/navigation'
const images = [
  'https://utfs.io/f/gJwF9AUmwKhH8SwyCntaDIG2bzh0nrjYQMmpRyxwBZTP5FeJ',
  'https://utfs.io/f/gJwF9AUmwKhHjw15Cwr7g69FB1oR2YZhqyriVHztKuXbevSD',
  'https://utfs.io/f/gJwF9AUmwKhHg6pREYmwKhHftOrznWV1piUy7csa20RbLG4C',
]

const LandingImages = () => {
    const router = useRouter(); 
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleIndex, setVisibleIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      setVisibleIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (currentIndex === 0) {
      setTimeout(() => {
        setVisibleIndex(0)
      }, 2000)
    }
  }, [currentIndex])

  const onClickButton = () => {
    router.push("/signInPage");


  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2 relative">
          <div className="relative w-full h-[400px] overflow-hidden rounded-3xl">
            {images.map((src, index) => (
              <div
                key={index}
                className={`absolute w-full h-full transition-transform duration-1000 ease-in-out ${
                  index === visibleIndex ? 'translate-y-0' : 'translate-y-full'
                }`}
                style={{
                  transitionDelay: `${index === visibleIndex ? '0ms' : '0ms'}`,
                }}
              >
                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent text-white rounded-t-3xl">
            <h2 className="text-4xl font-bold drop-shadow-lg">
             Post'em, Chat'em, Show'em.
            </h2>
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-6">
          <h3 className="text-3xl font-semibold">Connect Like Never Before</h3>
          <p className="text-lg text-muted-foreground">
            Experience the future of communication with our cutting-edge chat platform. 
            Connect with friends, family, and colleagues instantly, share ideas, and 
            collaborate in real-time. Our intuitive interface and powerful features 
            make staying in touch easier than ever.
          </p>
          <Button variant={"secondary"} size="lg" onClick={onClickButton} className="w-full md:w-auto">
            Sign Up/Login Now
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LandingImages