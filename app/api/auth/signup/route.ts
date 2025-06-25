import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getUsersDb } from '@/server/db';
import { users } from '@/server/db/schemas/users';
import { hashPassword, signJWT, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password, name, email, facility_id, facility_name } = await request.json();

    if (!username || !password || !name) {
      return NextResponse.json({ 
        error: 'Username, password, and name are required' 
      }, { status: 400 });
    }

    // Get database connection for users
    const db = await getUsersDb();

    // Check if username already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser[0]) {
      return NextResponse.json({ 
        error: 'Username already exists' 
      }, { status: 409 });
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        name,
        email,
        facility_id,
        facility_name,
        deactivated: 0,
      });

    // Get the created user
    const createdUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!createdUser[0]) {
      return NextResponse.json({ 
        error: 'Failed to create user' 
      }, { status: 500 });
    }

    const user = createdUser[0];

    // Create JWT token
    const token = signJWT({
      id: user.id,
      username: user.username,
      name: user.name,
      facility_id: user.facility_id,
    });

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        facility_id: user.facility_id,
        facility_name: user.facility_name,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 