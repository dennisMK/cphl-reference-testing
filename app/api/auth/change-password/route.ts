import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getUsersDb } from '@/server/db';
import { users } from '@/server/db/schemas/users';
import { getAuthToken, verifyJWT, verifyPassword, hashPassword } from '@/lib/auth';

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

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ 
        error: 'Current password and new password are required' 
      }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ 
        error: 'New password must be at least 6 characters long' 
      }, { status: 400 });
    }

    // Get database connection for users
    const db = await getUsersDb();

    // Get current user
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.id))
      .limit(1);

    if (!currentUser[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    if (!verifyPassword(currentPassword, currentUser[0].password)) {
      return NextResponse.json({ 
        error: 'Current password is incorrect' 
      }, { status: 400 });
    }

    // Hash new password
    const hashedNewPassword = hashPassword(newPassword);

    // Update password
    await db
      .update(users)
      .set({
        password: hashedNewPassword,
        updated_at: new Date(),
      })
      .where(eq(users.id, payload.id));

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 