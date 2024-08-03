import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { useAuthStore } from './store/AuthStore'
import { DomainUserWithProfile } from './domain/Users'
// This function can be marked `async` if using `await` inside
import {parseCookies} from 'nookies'

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value ?? null;
  const user = request.cookies.get('user')?.value ?? null;
  const userData : DomainUserWithProfile | null = user ? new DomainUserWithProfile(JSON.parse(user)) : null;

console.log(userData?.roles.includes('admin'))
console.log(userData)
  if(!token && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  

  if(pathname.startsWith('/processing') 
    && (
  !userData?.roles.includes('admin') || 
  !userData?.roles.includes('kurir') ||
  !userData?.roles.includes('kasir') ||
  !userData?.roles.includes('kitchen') ||
  !userData?.roles.includes('pimpinan'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if(pathname.startsWith('/processing/kurir') && !userData?.roles.includes('kurir')) {
    return NextResponse.redirect(new URL('/processing/403', request.url));
  }
  if(pathname.startsWith('/processing/chasier') && !userData?.roles.includes('kasir')) {
    return NextResponse.redirect(new URL('/processing/403', request.url));
  }
  if(pathname.startsWith('/processing/kitchen') && !userData?.roles.includes('kitchen')) {
    return NextResponse.redirect(new URL('/processing/403', request.url));
  }
  if(pathname.startsWith('/processing/orders') && (!userData?.roles.includes('admin') || !userData?.roles.includes('pimpinan'))) {
    return NextResponse.redirect(new URL('/processing/403', request.url));
  }
  if(pathname.startsWith('/processing/users') && !userData?.roles.includes('admin')) {
    return NextResponse.redirect(new URL('/processing/403', request.url));
  }
  if(pathname.startsWith('/processing/menus') && !userData?.roles.includes('admin')) {
    return NextResponse.redirect(new URL('/processing/403', request.url));
  }
  if(pathname.startsWith('/processing/others') && !userData?.roles.includes('admin')) {
    return NextResponse.redirect(new URL('/processing/403', request.url));
  }
  
  return NextResponse.next();
}

 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/processing/:route*',
    '/kurir/:route*',
  ],
}