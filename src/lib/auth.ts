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

const JWT_SECRET = process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRES_IN = '7d';

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

export async function getCurrentUser(): Promise<User | null> {
  const token = await getAuthToken();
  if (!token) return null;

  const payload = verifyJWT(token);
  if (!payload) return null;

  // Fetch fresh user data from the database to ensure we have the latest information
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
      facility_id: foundUser.facility_id,
      facility_name: foundUser.facility_name,
      hub_id: foundUser.hub_id,
      hub_name: foundUser.hub_name,
      deactivated: foundUser.deactivated,
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}
