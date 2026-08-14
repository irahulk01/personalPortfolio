import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/adminLogin');
  
  if (isAdminPath) {
    const authCookie = request.cookies.get('admin_auth');
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/adminLogin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
