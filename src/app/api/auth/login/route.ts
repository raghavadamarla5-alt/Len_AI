import { NextResponse } from 'next/server';
import { db } from '@/lib/mockDb';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { mobile, state } = await request.json();

    if (!mobile || mobile.length < 10) {
      return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 });
    }

    // Upsert user based on mobile (mock DB)
    let user = Array.from(db.users.values()).find(u => u.mobile === mobile);
    
    if (!user) {
      const id = "user-" + Math.random().toString(36).substring(2, 9);
      user = {
        id,
        name: "Citizen",
        mobile,
        email: null,
        avatarUrl: null,
        address: null,
        state: state || null,
        district: null,
        municipality: null,
        createdAt: new Date().toISOString()
      };
      db.users.set(id, user);
    }

    // Set HTTP-only cookie for session
    cookies().set('auth_session', user.id, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Logged in successfully',
      data: {
        mobile: user.mobile,
        name: user.name
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

