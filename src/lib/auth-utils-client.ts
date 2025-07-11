import jwt from 'jsonwebtoken';

export interface JWTPayload {
  id: number;
  username: string;
  name: string;
  facility_id: number | null;
  iat: number;
  exp: number;
}

// For client-side verification, we need to use a public secret or skip verification
// In production, you might want to validate tokens server-side only
export function verifyJWTClient(token: string): JWTPayload | null {
  try {
    // For client-side, we'll decode without verification (just parse)
    const decoded = jwt.decode(token) as JWTPayload;
    
    // Check if token is expired
    if (!decoded || !decoded.exp) return null;
    
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) return null;
    
    return decoded;
  } catch (error) {
    return null;
  }
}

// Client-side cookie management
export function clearAuthCookie() {
  if (typeof document === 'undefined') return;
  
  // Clear the auth-token cookie by setting it to expire in the past
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
}

export function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => 
    cookie.trim().startsWith('auth-token=')
  );
  
  if (!authCookie) return null;
  
  return authCookie.split('=')[1] || null;
} 