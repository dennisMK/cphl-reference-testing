import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Trusted IP addresses
const TRUSTED_IPS = [
  '10.200.254.76',
  '105.27.246.92',
  '127.0.0.1',
  'localhost'
];

function getClientIP(request: NextRequest): string | null {
  // Check various headers for the real IP
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIp = request.headers.get('x-real-ip');
  const xClientIp = request.headers.get('x-client-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  // x-forwarded-for can contain multiple IPs, use the first one
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0]?.trim() || null;
  }
  
  return xRealIp || xClientIp || cfConnectingIp || request.ip || null;
}

function isTrustedIP(ip: string | null): boolean {
  if (!ip) return false;
  return TRUSTED_IPS.includes(ip);
}

export function middleware(request: NextRequest) {
  const clientIP = getClientIP(request);
  const isFromTrustedIP = isTrustedIP(clientIP);
  
  // Log IP information for debugging
  console.log(`Request from IP: ${clientIP}, Trusted: ${isFromTrustedIP}`);
  
  // Add IP information to headers for downstream use
  const response = NextResponse.next();
  if (clientIP) {
    response.headers.set('x-client-ip', clientIP);
  }
  
  if (isFromTrustedIP) {
    response.headers.set('x-trusted-ip', 'true');
    console.log(`Trusted IP access granted: ${clientIP}`);
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 