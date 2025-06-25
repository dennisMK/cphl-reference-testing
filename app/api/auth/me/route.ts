import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getUsersDb } from '@/server/db';
import { users } from '@/server/db/schemas/users';
import { getAuthToken, verifyJWT } from '@/lib/auth';

export async function GET() {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get fresh user data from database
    const db = await getUsersDb();
    const user = await db.select().from(users).where(eq(users.id, payload.id)).limit(1);

    if (!user[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const foundUser = user[0];

    // Check if account is still active
    if (foundUser.deactivated === 1) {
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        email: foundUser.email,
        telephone: foundUser.telephone,
        facility_id: foundUser.facility_id,
        facility_name: foundUser.facility_name,
        hub_id: foundUser.hub_id,
        hub_name: foundUser.hub_name,
        other_facilities: foundUser.other_facilities,
        ip_id: foundUser.ip_id,
        ip_name: foundUser.ip_name,
        requesting_facility_id: foundUser.requesting_facility_id,
      },
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 