import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getUsersDb } from '@/server/db';
import { users } from '@/server/db/schemas/users';
import { verifyPassword, signJWT, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    console.log('Login attempt for username:', username);

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    let foundUser;

    try {
      // Get database connection for users
      const db = await getUsersDb();

      // Find user by username
      const user = await db.select().from(users).where(eq(users.username, username)).limit(1);
      console.log('User found:', user.length > 0 ? 'Yes' : 'No');

      if (!user[0]) {
        console.log('No user found with username:', username);
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        );
      }

      foundUser = user[0];
      console.log('Found user:', { id: foundUser.id, username: foundUser.username, deactivated: foundUser.deactivated });

      // Check if user is deactivated
      if (foundUser.deactivated === 1) {
        console.log('User is deactivated');
        return NextResponse.json(
          { error: 'Account is deactivated' },
          { status: 401 }
        );
      }

      // Verify password
      const passwordMatch = verifyPassword(password, foundUser.password);
      console.log('Password match:', passwordMatch);
      
      if (!passwordMatch) {
        console.log('Password verification failed');
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        );
      }
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed. Please ensure MySQL is running and the database exists.' },
        { status: 500 }
      );
    }

    // Clear any existing auth cookie first
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');

    // Create JWT token (expires in 7 days)
    const token = signJWT({
      id: foundUser.id,
      username: foundUser.username,
      name: foundUser.name,
      facility_id: foundUser.facility_id,
    });

    // Set new cookie
    await setAuthCookie(token);

    // Return success response (without sensitive data)
    return NextResponse.json({
      success: true,
      user: {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        email: foundUser.email,
        facility_id: foundUser.facility_id,
        facility_name: foundUser.facility_name,
        hub_id: foundUser.hub_id,
        hub_name: foundUser.hub_name,
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