import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string | null;
  facility_id: number | null;
  facility_name: string | null;
  hub_id: number | null;
  hub_name: string | null;
  deactivated: number;
}

export interface JWTPayload {
  id: number;
  username: string;
  name: string;
  facility_id: number | null;
  iat: number;
  exp: number;
}

// Trusted IP addresses that can bypass token validation
const TRUSTED_IPS = [
  '10.200.254.76',
  '105.27.246.92',
  '127.0.0.1',
  'localhost'
];

const JWT_SECRET = process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRES_IN = '7d';

// Helper function to get client IP address
export function getClientIP(headers: Headers): string | null {
  // Check various headers for the real IP
  const xForwardedFor = headers.get('x-forwarded-for');
  const xRealIp = headers.get('x-real-ip');
  const xClientIp = headers.get('x-client-ip');
  const cfConnectingIp = headers.get('cf-connecting-ip');
  
  // x-forwarded-for can contain multiple IPs, use the first one
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0]?.trim() || null;
  }
  
  return xRealIp || xClientIp || cfConnectingIp || null;
}

// Check if IP is in trusted list
export function isTrustedIP(ip: string | null): boolean {
  if (!ip) return false;
  return TRUSTED_IPS.includes(ip);
}

// Check if request is from trusted IP using headers
export function isTrustedRequest(headers: Headers): boolean {
  const trustedHeader = headers.get('x-trusted-ip');
  const clientIP = getClientIP(headers);
  return trustedHeader === 'true' || isTrustedIP(clientIP);
}

export function hashPassword(password: string): string {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}

export function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');
  return token?.value || null;
}

export async function getCurrentUser(headers?: Headers): Promise<User | null> {
  // Check if request is from a trusted IP
  let isTrusted = false;
  if (headers) {
    isTrusted = isTrustedRequest(headers);
    if (isTrusted) {
      const clientIP = getClientIP(headers);
      console.log(`Request from trusted IP: ${clientIP}, allowing extended access`);
    }
  }

  const token = await getAuthToken();
  
  // For trusted IPs, we can be more lenient with token validation
  if (!token && !isTrusted) {
    return null;
  }
  
  // If we have a token, validate it regardless of IP
  if (token) {
    const payload = verifyJWT(token);
    if (!payload && !isTrusted) {
      return null;
    }
    
    if (payload) {
      // Continue with normal token-based auth
      try {
        const { getUsersDb } = await import('@/server/db');
        const { users } = await import('@/server/db/schemas/users');
        const { eq } = await import('drizzle-orm');
        
        const db = await getUsersDb();
        const user = await db.select().from(users).where(eq(users.id, payload.id)).limit(1);

        if (!user[0] || user[0].deactivated === 1) {
          return null;
        }

        const foundUser = user[0];
        return {
          id: foundUser.id,
          username: foundUser.username,
          name: foundUser.name,
          email: foundUser.email,
          facility_id: foundUser.facilityId,
          facility_name: foundUser.facilityName,
          hub_id: foundUser.hubId,
          hub_name: foundUser.hubName,
          deactivated: foundUser.deactivated,
        };
      } catch (error) {
        console.error('Error fetching current user:', error);
        if (!isTrusted) return null;
      }
    }
  }
  
  // For trusted IPs without valid tokens, return a default system user
  if (isTrusted) {
    console.log('Providing default system access for trusted IP');
    return {
      id: -1, // Special ID for trusted IP access
      username: 'system',
      name: 'System User (Trusted IP)',
      email: null,
      facility_id: 1,
      facility_name: 'System',
      hub_id: 1,
      hub_name: 'System Hub',
      deactivated: 0,
    };
     }
  
    return null;
  }

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}
