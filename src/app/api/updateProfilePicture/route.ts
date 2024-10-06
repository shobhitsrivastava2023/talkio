import { prisma } from "@/db/db";
import next from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const {userId, imageUrl} = await req.json(); 
        const url = await prisma.user.update({
           where : {
            id: userId,
           },
           data : {
            avatar : imageUrl
           }
        })
        if(url){      
            return  NextResponse.json({ url }, { status: 200 });
        }
        else{
            NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
        }
    } catch (error) {
        NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
    
    


}