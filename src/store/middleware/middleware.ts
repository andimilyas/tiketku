import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  console.log("Middleware running for:", req.nextUrl.pathname);
  // Cek hanya untuk path dashboard
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("Token di middleware:", token);
    if (!token || typeof token.role !== 'string') {
      // Belum login
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    if (token.role !== 'admin') {
      console.log('Redirecting non-admin:', token.role);
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }
  return NextResponse.next();
}

// Aktifkan middleware hanya untuk /dashboard
export const config = {
  matcher: ['/dashboard/:path*'],
};