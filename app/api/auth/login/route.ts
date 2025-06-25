import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getUsersDb } from '@/server/db';
import { users } from '@/server/db/schemas/users';
import { verifyPassword, signJWT, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Get database connection for users
    const db = await getUsersDb();

    // Find user by username
    const user = await db.select().from(users).where(eq(users.username, username)).limit(1);

    if (!user[0]) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const foundUser = user[0];

    // Check if user is deactivated
    if (foundUser.deactivated === 1) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }

    // Verify password
    if (!verifyPassword(password, foundUser.password)) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = signJWT({
      id: foundUser.id,
      username: foundUser.username,
      name: foundUser.name,
      facility_id: foundUser.facility_id,
    });

    // Set cookie
    await setAuthCookie(token);

    // Return success response (without sensitive data)
    return NextResponse.json({
      success: true,
      user: {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        facility_id: foundUser.facility_id,
        facility_name: foundUser.facility_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 