import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { corsMiddleware } from './middlewares';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api'))
    return corsMiddleware(request);

  return NextResponse.next();
}

export const config = {
  matcher:
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
};
