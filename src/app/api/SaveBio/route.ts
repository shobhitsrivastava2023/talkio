import { prisma } from "@/db/db";
import { NextResponse } from "next/server";

export async function POST(req: Request){ 
  try {
    console.log('this is working');
    const { userId , bio } = await req.json();

    if (!userId || !bio) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const bioUpdate = await prisma.user.update({
      where: {
        id: userId,
      }, 
      data : {
        bio: bio, 
      }
    });

    return NextResponse.json({ message: 'Bio updated successfully', bio: bioUpdate }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId');
  
      if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
      }
  
      const getBio = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          bio: true,
          avatar: true, 
          username: true, 
        },
      });
  
      if (!getBio) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json({ bio: getBio.bio, avatar: getBio.avatar, username: getBio.username }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
  }
  