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
  try {
    const { searchParams } = new URL(req.url);
    const senderId = searchParams.get('senderId');
    const receiverId = searchParams.get('receiverId');

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: 'Missing sender or receiver ID' }, { status: 400 });
    }

    // Fetch invite status from the database
    const invite = await prisma.invite.findFirst({
      where: {
        senderId,
        receiverId,
      },
    });

    if (!invite) {
      return NextResponse.json({ status: 'not_sent' });
    }

    return NextResponse.json({ status: invite.status });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
