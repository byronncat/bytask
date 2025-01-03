import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import session from '@/libraries/session';
import { ROUTE } from '@/constants/serverConfig';
import type { SessionPayload } from 'api';

const publicRoutes = [ROUTE.LANDING];
const protectedRoutes = [ROUTE.DASHBOARD];
const authRoutes = [ROUTE.LOGIN, ROUTE.SIGNUP];

export async function authorizationMiddleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const isProtectedRoute = protectedRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  if (isPublicRoute) {
    return NextResponse.next();
  }

  try {
    const cookie = (await cookies()).get('session')?.value;
    const sessionData = (await session.decrypt(cookie)) as SessionPayload;

    if (isProtectedRoute && !sessionData?.id) {
      return NextResponse.redirect(new URL(ROUTE.LOGIN, req.nextUrl));
    }

    if (isAuthRoute && sessionData?.id) {
      return NextResponse.redirect(new URL(ROUTE.DASHBOARD, req.nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('[Authorization]', '- Failed to authorize', error);
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }
}
