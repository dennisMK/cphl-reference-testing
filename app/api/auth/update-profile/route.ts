import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getUsersDb } from '@/server/db';
import { users } from '@/server/db/schemas/users';
import { getAuthToken, verifyJWT } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { name, email, facility_name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Get database connection for users
    const db = await getUsersDb();

    // Update user profile
    await db
      .update(users)
      .set({
        name,
        email,
        facility_name,
        updated_at: new Date(),
      })
      .where(eq(users.id, payload.id));

    // Get updated user data
    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.id))
      .limit(1);

    if (!updatedUser[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser[0].id,
        username: updatedUser[0].username,
        name: updatedUser[0].name,
        email: updatedUser[0].email,
        facility_id: updatedUser[0].facility_id,
        facility_name: updatedUser[0].facility_name,
        hub_id: updatedUser[0].hub_id,
        hub_name: updatedUser[0].hub_name,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 