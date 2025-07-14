import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getUsersDb } from '@/server/db';
import { users } from '@/server/db/schemas/users';
import { getAuthToken, verifyJWT, isTrustedRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Check if request is from a trusted IP
    const headers = new Headers(request.headers);
    const isFromTrustedIP = isTrustedRequest(headers);
    
    if (isFromTrustedIP) {
      console.log('Auth request from trusted IP');
    }
    
    const token = await getAuthToken();
    
    if (!token && !isFromTrustedIP) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    let payload = null;
    if (token) {
      payload = verifyJWT(token);
      if (!payload && !isFromTrustedIP) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }

    // Handle trusted IP without valid token
    if (!payload && isFromTrustedIP) {
      return NextResponse.json({
        user: {
          id: -1,
          username: 'system',
          name: 'System User (Trusted IP)',
          email: null,
          telephone: null,
          facility_id: 1,
          facility_name: 'System',
          hub_id: 1,
          hub_name: 'System Hub',
          other_facilities: null,
          ip_id: null,
          ip_name: null,
          requesting_facility_id: null,
        },
      });
    }

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
        facility_id: foundUser.facilityId,
        facility_name: foundUser.facilityName,
        hub_id: foundUser.hubId,
        hub_name: foundUser.hubName,
        other_facilities: foundUser.otherFacilities,
        ip_id: foundUser.ipId,
        ip_name: foundUser.ipName,
        requesting_facility_id: foundUser.requestingFacilityId,
      },
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 