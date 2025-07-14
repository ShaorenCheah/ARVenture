// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('Role from cookie:', req.cookies.get('role')?.value);
  const role = req.cookies.get('role')?.value;
  const pathname = req.nextUrl.pathname;

  const isAdminOrMerchant = role === 'admin' || role === 'merchant';

  // Redirect admin/merchant away from / or /user routes
  if (isAdminOrMerchant && (pathname === '/' || pathname.startsWith('/user'))) {
    const adminUrl = req.nextUrl.clone();
    adminUrl.pathname = '/admin';
    return NextResponse.redirect(adminUrl);
  }

  // Block access to /admin if not admin/merchant
  if (pathname.startsWith('/admin') && !isAdminOrMerchant) {
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
