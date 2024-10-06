import { NextResponse } from 'next/server';
import { prisma } from '@/db/db';  // Adjust the import path if necessary
import bcryptjs from 'bcryptjs';
import { lucia } from '@/lib/auth';
import { cookies } from "next/headers";
// Define the POST request handler
export async function POST(req: Request) {
  try {
    const body = await req.text(); 
    
    const { email, password, username } = JSON.parse(body); // Parse the request body
    const hashedPassword = await bcryptjs.hash(password, 10); 
    if (!email || !password || !username) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
   
    try {
        const emailExist = await prisma.user.findUnique({
            where: {
                email,
            },
        })
        if(emailExist){
            console.log("this exist")
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }
    } catch (error) {

     
        
    }

    // Create a new user
    const user = await prisma.user.create({
      data: {
        email : email,
        password : hashedPassword,
        username: username,
      },
    });
    const session = await lucia.createSession(user.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    

    if (!user) {
      return NextResponse.json({ error: 'User not created' }, { status: 500 });
    }
    

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
   
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
