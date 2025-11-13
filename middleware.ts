import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'park-m-session';

// Public paths that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/init',
  '/api/init-db',
  '/api/reset-db'
];

// API paths that require authentication
const protectedApiPaths = [
  '/api/trees',
  '/api/projects',
  '/api/photos',
  '/api/lookups',
  '/api/add-tree-number',
  '/api/auth/me'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ALWAYS allow public paths - no checks at all
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    (pathname.includes('.') && !pathname.includes('/api/'))
  ) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie?.value) {
    // Redirect to login for protected pages
    if (!pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Return 401 for protected API routes
    if (protectedApiPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.json(
        { error: 'Unauthorized - Wymagane logowanie' },
        { status: 401 }
      );
    }
    
    return NextResponse.next();
  }

  // Validate session
  try {
    const sessionData = JSON.parse(sessionCookie.value);
    
    // Check if session has required fields
    if (!sessionData.userId || !sessionData.expiresAt) {
      throw new Error('Invalid session data');
    }
    
    if (sessionData.expiresAt < Date.now()) {
      // Session expired
      if (!pathname.startsWith('/api/')) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete(SESSION_COOKIE_NAME);
        return response;
      }
      
      return NextResponse.json(
        { error: 'Session expired - Sesja wygasła' },
        { status: 401 }
      );
    }
  } catch (error) {
    // Invalid session cookie - delete it and redirect
    if (!pathname.startsWith('/api/')) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }
    
    return NextResponse.json(
      { error: 'Invalid session - Nieprawidłowa sesja' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
