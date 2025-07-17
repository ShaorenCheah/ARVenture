// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const role = req.cookies.get('role')?.value;
  const pathname = req.nextUrl.pathname;

  const isAdminOrEmployee = role === 'admin' || role === 'employee';

  // Redirect admin/employee away from / or /user routes
  if (isAdminOrEmployee && (pathname === '/' || pathname.startsWith('/user'))) {
    const adminUrl = req.nextUrl.clone();
    adminUrl.pathname = '/admin';
    return NextResponse.redirect(adminUrl);
  }

  // Block access to /admin if not admin/employee
  if (pathname.startsWith('/admin') && !isAdminOrEmployee) {
    return NextResponse.rewrite(new URL('/404', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
    '/', // optional: to protect root
  ],
};
