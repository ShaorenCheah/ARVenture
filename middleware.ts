import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const role = req.cookies.get('role')?.value;
  const pathname = req.nextUrl.pathname;

  const isAdmin = role === 'admin';
  const isEmployee = role === 'employee';

  // Redirect authenticated admins/employees away from user home
  if ((isAdmin || isEmployee) && (pathname === '/' || pathname.startsWith('/user'))) {
    const target = req.nextUrl.clone();
    target.pathname = '/admin';
    return NextResponse.redirect(target);
  }

  // Block unauthorized access to /admin
  if (pathname.startsWith('/admin')) {
    // If no valid role cookie
    if (!isAdmin && !isEmployee) {
      return NextResponse.rewrite(new URL('/404', req.url));
    }

    // Restrict access for employee
    const employeeBlocked = [
      '/admin/users',
      '/admin/ar-spots',
      '/admin/collectibles',
      '/admin/redemption-items',
    ];

    const isBlocked = employeeBlocked.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    if (isEmployee && isBlocked) {
      return NextResponse.rewrite(new URL('/404', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/'],
};
