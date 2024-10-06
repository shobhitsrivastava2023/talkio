import { prisma } from "@/db/db";
import { NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const body  = await req.text()
        const {email, password} = await JSON.parse(body);
        if (!email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }
        
        const Existinguser = await  prisma.user.findUnique({
            where: {
                email: email
            } ,
            select : {
                password: true ,
                id: true
            }
              
        })
        if(!Existinguser) {
            return NextResponse.json({ error: 'User not found' }, { status: 400 });
        }
       
        const isPasswordValid = await bcryptjs.compare(password, Existinguser.password ); 
        if(!isPasswordValid){
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        const session = await lucia.createSession(Existinguser.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return NextResponse.json({ message: 'Login successful' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        
    }
}
