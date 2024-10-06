"use client"
import React from 'react'
import { z } from 'zod'
import { useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Header } from '../components/AuthComponents/Header'
import Link from 'next/link'
import {useRouter} from 'next/navigation'

const formSchema = z.object({
   
    email : z.string().min(6, {message: "Email is required"}),
    password : z.string().min(6, {message: "Password is required"}),
   
})




const SigninForm = () => {
    const router = useRouter(); 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
           
            email: "",
            password: "",
          
        },
    })
    async function onSubmit (data: z.infer<typeof formSchema>) {
       try {
       const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(data),
        })
        const result = await response.json()

        if (response.status === 200) {
            console.log('User loggedin successfully')
            router.push('/Dashboard') // Redirect to login page on success
          } else {
            console.log(result.message)
          }
        } catch (error) {
          console.log(error)
        }
       
    }
  return (
    <div className='flex items-center justify-center text-sm '>
        <Form {...form}>
            <div className='bg-zinc-900 p-6 w-96 rounded-xl'>
                <Header headerTitle="Login In To Talkio" />

          
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 text-white'>
            <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                       
                        <Input placeholder="Email" className='bg-black' type='email' {...field} />
                       
                        <FormMessage />
                    </FormItem>
                )} />

                
                
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                       
                        <Input placeholder="Password" className='bg-black' type='password' {...field} />
                       
                        <FormMessage />
                    </FormItem>
                )} />
                <FormItem>
                <Link href = {"/signInPage"} className="mt-4 text-white underline"> Don't Have An Account ?</Link>
                </FormItem>
                
              

                <div className='flex items-center justify-center'>
                <Button variant={"secondary"} type="submit">Submit</Button>
                </div>
              
                    
               
            </form>
            </div>

        </Form>

      
    </div>
  )
}

export default SigninForm