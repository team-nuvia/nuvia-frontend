import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/about',
  '/settings',
  '/invitation',
  '/privacy-policy',
  '/terms-of-service',
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((publicPath) => publicPath === pathname || pathname.startsWith(publicPath + '/'));
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const url = req.nextUrl.clone();

  // 세션 쿠키(예: 'session' 또는 'access_token') 존재 여부만 빠르게 체크
  const hasSession = Boolean(req.cookies.get('refresh_token')?.value);

  if (!hasSession && !isPublicPath(pathname)) {
    url.pathname = '/auth/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (hasSession && (pathname === '/auth/login' || pathname === '/auth/signup' || pathname === '/auth/forgot-password')) {
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
