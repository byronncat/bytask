import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { SessionPayload } from 'api';

const protectedRoutes = ['/'];
const publicRoutes = ['/login', '/signup'];

import { jwtVerify } from 'jose';
const secretKey = process.env.SESSION_SECRET || 'secret';
const encodedKey = new TextEncoder().encode(secretKey);
async function decrypt(session: string | undefined = '') {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('[JWT]:'.red, '- Failed to verify session', error);
    return null;
  }
}

export async function authorizationMiddleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  try {
    const cookie = (await cookies()).get('session')?.value;
    console.log('cookie', cookie);
    const session = (await decrypt(cookie)) as SessionPayload;

    if (isProtectedRoute && !session?.userId) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (
      isPublicRoute &&
      session?.userId &&
      !req.nextUrl.pathname.startsWith('/')
    ) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }
}
