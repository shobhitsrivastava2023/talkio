import { prisma } from "@/db/db";
import { NextResponse } from "next/server";

export async function GET(req: Request,  { params }: { params: { id: string } }) {
    const {id} = params; 
    try {
        const user = await prisma.user.findUnique({
            where: {
                id : id, 

            }, 
            select : {
                username : true, 
                avatar : true, 
            } 

    })
        return NextResponse.json(user)
        
    } catch (error) {
        
    }
    
}