import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate Request ID
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
  const startTime = Date.now().toString();

  const response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });

  // Inject Request ID into original headers so downstream routes can read it
  response.headers.set('x-request-id', requestId);
  
  // Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  // CORS Basics
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-request-id');

  // Basic Timing (Logged later in routes)
  response.headers.set('x-start-time', startTime);

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
