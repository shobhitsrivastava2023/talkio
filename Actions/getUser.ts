import { prisma } from "@/db/db"
import { NextResponse } from "next/server";

async function getUser(id: string) {
    try {
        const response = await prisma.user.findUnique({
            where : {
                id : id, 
            },
            select : {
                id : true, 
                username : true, 
                avatar : true,
                userprofile : true,
            }

        })
        if(!response){
            return NextResponse.json({error : "User not found"}, {status : 404})
        }

        return response; 
        
    } catch (error) {
        return NextResponse.json({error: "User Not Found"}, {status : 500}); 
    }
    
}