import { corsMiddleware, authorizationMiddleware } from './middlewares';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api'))
    return corsMiddleware(request);

  return authorizationMiddleware(request);
}

export const config = {
  matcher:
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
};
