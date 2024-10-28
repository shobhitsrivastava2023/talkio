'use client'

import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { User, Send } from 'lucide-react'
import { addDoc, collection, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore'
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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await validateRequest()
      if (user?.user) {
        setCurrentUser({ id: user.user.id, username: user.user.username })
      }
    }
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    if (!receiver) return

    const messageRef = collection(db, "messages")
    const q = query(messageRef, orderBy("createdAt"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().text,
        senderId: doc.data().user,
        senderName: doc.data().username,
        timestamp: doc.data().createdAt?.toDate(),
      }))
      setMessages(fetchedMessages)
    })

    return () => unsubscribe()
  }, [receiver])

  if (!receiver) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a chat to start messaging
      </div>
    )
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser) return

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: currentUser.id,
        username: currentUser.username,
        receivername: receiver.username,
      })

      setNewMessage('')
    } catch (error) {
      console.error("Error sending message: ", error)
    }
  }

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

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex flex-col max-w-[70%]">
                <div
                  className={`rounded-lg p-3 ${
                    message.senderId === currentUser?.id
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-zinc-700 text-white rounded-bl-none'
                  }`}
                >
                  {message.content}
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  {message.senderId === currentUser?.id ? 'You' : message.senderName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

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