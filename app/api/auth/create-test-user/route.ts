import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getUsersDb } from '@/server/db';
import { users } from '@/server/db/schemas/users';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('Creating test user...');
    
    const db = await getUsersDb();
    
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.username, 'testuser')).limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Test user already exists',
        credentials: {
          username: 'testuser',
          password: 'password123'
        }
      });
    }
    
    // Hash the password "password123"
    const hashedPassword = hashPassword('password123');
    console.log('Password hashed');
    
    // Create test user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      username: 'testuser',
      telephone: '0701234567',
      facility_id: 1,
      facility_name: 'Test Facility',
      hub_id: 1,
      hub_name: 'Test Hub',
      deactivated: 0,
    };
    
    const result = await db.insert(users).values(testUser);
    console.log('Test user created successfully:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Test user created successfully',
      credentials: {
        username: 'testuser',
        password: 'password123'
      }
    });
    
  } catch (error) {
    console.error('Error creating test user:', error);
    return NextResponse.json(
      { error: 'Failed to create test user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 