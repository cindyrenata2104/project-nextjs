import { NextRequest, NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/karyawan/:path*",
    "/inventory/:path*",
    "/peminjaman/:path*",
    "/pengembalian/:path*",
    "/riwayat/:path*",
  ],
};
export const PUBLIC_PATHS = ['/login'];

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token &&!PUBLIC_PATHS.includes(request.nextUrl.pathname)){
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
  
}
  
