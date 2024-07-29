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

  if(pathname === '/processing' && !userData?.roles.includes('admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if(pathname === '/kurir' && !userData?.roles.includes('kurir')) {
    return NextResponse.redirect(new URL('/', request.url));
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