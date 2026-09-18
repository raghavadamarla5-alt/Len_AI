import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/mockDb';

export async function GET() {
  try {
    const user = getSessionUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate mock complaint stats
    const stats = {
      total: 3,
      active: 1,
      resolved: 2
    };

    return NextResponse.json({ success: true, profile: user, stats });
  } catch (error) {
    console.error("GET /api/profile error", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = getSessionUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();

    // Prevent updating critical fields directly
    delete updates.id;
    delete updates.mobile;
    delete updates.createdAt;

    // Apply updates
    const updatedUser = { ...user, ...updates };
    db.users.set(user.id, updatedUser);

    return NextResponse.json({ success: true, profile: updatedUser });
  } catch (error) {
    console.error("Profile update error", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
