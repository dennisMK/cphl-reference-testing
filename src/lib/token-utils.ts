import { verifyJWTClient } from './auth-utils-client';

export interface TokenInfo {
  isValid: boolean;
  expiresAt: Date | null;
  isExpiring: boolean; // true if expires within 24 hours
}

export function checkTokenExpiration(token: string): TokenInfo {
  const payload = verifyJWTClient(token);
  
  if (!payload || !payload.exp) {
    return {
      isValid: false,
      expiresAt: null,
      isExpiring: false,
    };
  }

  const expiresAt = new Date(payload.exp * 1000);
  const now = new Date();
  const hoursUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  return {
    isValid: expiresAt > now,
    expiresAt,
    isExpiring: hoursUntilExpiry <= 24 && hoursUntilExpiry > 0,
  };
}

export function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => 
    cookie.trim().startsWith('auth-token=')
  );
  
  if (!authCookie) return null;
  
  return authCookie.split('=')[1] || null;
} 