'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { User, Send } from 'lucide-react'
import { 
  addDoc, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  where,
  Unsubscribe, 
  and,
  or
} from 'firebase/firestore'
import { db } from '../../../../../firebase-config'
import { validateRequest } from '@/lib/validate-request'

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: Date
  senderName: string
}

interface ChatReceiver {
  id: string
  username: string
  avatar: string
}

export default function ChatRoom({ receiver }: { receiver: ChatReceiver | null }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null)
  const unsubscribeRef = useRef<Unsubscribe | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch current user
  useEffect(() => {
    let mounted = true

    const fetchCurrentUser = async () => {
      try {
        const user = await validateRequest()
        if (user?.user && mounted) {
          setCurrentUser({ id: user.user.id, username: user.user.username })
        }
      } catch (error) {
        console.error('Error fetching current user:', error)
      }
    }

    fetchCurrentUser()

    return () => {
      mounted = false
    }
  }, [])

  // Set up message listener
  useEffect(() => {
    // Clean up previous subscription if it exists
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }

    if (!receiver?.username || !currentUser?.username) {
      return
    }

    try {
      const messageRef = collection(db, "messages")
  const messageQuery = query(
    messageRef,
    or(
      and(
        where("username", "==", currentUser.username),
        where("receivername", "==", receiver.username)
      ),
      and(
        where("username", "==", receiver.username),
        where("receivername", "==", currentUser.username)
      )
    ),
    orderBy("createdAt", "asc")
  )
      

      const unsub =  onSnapshot(
        messageQuery,
        (snapshot) => {
          const fetchedMessages = snapshot.docs.map((doc) => {
            const data = doc.data()
            return {
              id: doc.id,
              content: data.text,
              senderId: data.user,
              senderName: data.username,
              timestamp: data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date(),
            }
          })
          setMessages(fetchedMessages)
        },
        (error) => {
          console.error("Error in message subscription:", error)
        }
      )

      // Store unsubscribe function in ref
      unsubscribeRef.current = unsub

      // Cleanup function
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current()
          unsubscribeRef.current = null
        }
      }
    } catch (error) {
      console.error("Error setting up message listener:", error)
    }
  }, [receiver?.username, currentUser?.username])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  // Handle message sending
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser || !receiver) return

    try {
      const messageData = {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: currentUser.id,
        username: currentUser.username,
        receivername: receiver.username,
        senderName: currentUser.username,
        roomId : 'room1',

      }

      await addDoc(collection(db, "messages"), messageData)
      setNewMessage('')
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  if (!receiver || !currentUser) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        {!receiver ? "Select a chat to start messaging" : "Loading user information..."}
      </div>
    )
  }

  console.log(messages); 
 
  return (
    <div className="h-full flex flex-col bg-zinc-900 rounded-md">
      <div className="flex items-center space-x-3 p-4 border-b border-zinc-700">
        <Avatar>
          <AvatarImage src={receiver.avatar} alt={receiver.username} className="object-cover" />
          <AvatarFallback>
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <h2 className="font-semibold text-white">{receiver.username}</h2>
      </div>
      <div className='h-[500px]'>

    
      <ScrollArea className="flex-1 h-[500px] p-4"> {/* Set a fixed height */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400">No messages yet</div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentUser.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex flex-col max-w-[70%]">
                    <div
                      className={`rounded-lg p-3 ${
                        message.senderId === currentUser.id
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-zinc-700 text-white rounded-bl-none"
                      }`}
                    >
                      {message.content}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      {message.senderId === currentUser.id ? "You" : message.senderName}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} /> {/* Scroll anchor */}
            </>
          )}
        </div>
      </ScrollArea>
      </div>

    

      <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-700">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
          />
          <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}