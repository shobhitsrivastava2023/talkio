import { prisma } from "@/db/db";
import { NextResponse } from "next/server";

// Handle both POST (to send an invite) and GET (to check invite status)
export async function POST(req: Request) { 
    try {
        const body = await req.text();
        console.log(body);

        const { senderId, receiverId } = JSON.parse(body);
        if (!senderId || !receiverId) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const invite = await prisma.invite.create({ 
            data: {
                senderId: senderId,
                receiverId: receiverId
            }
        });
        if (invite) {
            return NextResponse.json({ message: 'Invite sent successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}

// GET request to check if an invite is pending between two users
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const senderId = searchParams.get('senderId');
    const receiverId = searchParams.get('receiverId');

    if (!senderId || !receiverId) {
        return NextResponse.json({ error: 'Both senderId and receiverId are required' }, { status: 400 });
    }

    try {
        const existingInvite = await prisma.invite.findFirst({
            where: {
                senderId: senderId,
                receiverId: receiverId,
                status: 'pending',  // Check if there's a pending invite
            },
        });

        if (existingInvite) {
            return NextResponse.json({ status: 'pending' }, { status: 200 });
        } else {
            return NextResponse.json({ status: 'none' }, { status: 200 });
        }
    } catch (error) {
        console.error('Error checking invite status:', error);
        return NextResponse.json({ error: 'Failed to check invite status' }, { status: 500 });
    }
}
