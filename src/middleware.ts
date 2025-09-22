import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PUBLIC_PATHS = [
  '/',
  '/invitation',
  '/howtouse',
  '/pricing',
  '/privacy-policy',
  '/terms-of-service',
  '/about',
  //
];
const GUEST_PATHS = ['/auth/login', '/auth/signup', '/auth/forgot-password'];
const MEMBER_PATHS = ['/dashboard'];

function isPublicPath(pathname: string) {
  return pathname && PUBLIC_PATHS.some((publicPath) => publicPath === pathname || pathname.startsWith(publicPath + '/'));
}

function isGuestPath(pathname: string) {
  return pathname && (pathname === '/' || GUEST_PATHS.some((guestPath) => guestPath === pathname || pathname.startsWith(guestPath + '/')));
}

function isMemberPath(pathname: string) {
  return pathname && MEMBER_PATHS.some((memberPath) => memberPath === pathname || pathname.startsWith(memberPath + '/'));
}

async function forceLogout(req: NextRequest) {
  await axios.post(
    `${API_URL}/auth/logout`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    },
  );
}

async function verifySession(req: NextRequest): Promise<string | null> {
  try {
    const response = await axios.post(
      `${API_URL}/auth/session`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    );
    return response.data.payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();

  // 세션 쿠키(예: 'session' 또는 'access_token') 존재 여부만 빠르게 체크
  const session = req.cookies.get('session')?.value;
  const refreshToken = req.cookies.get('refresh_token')?.value;
  const redirect = url.pathname;

  if (!session) {
    if (!refreshToken && isMemberPath(pathname)) {
      // console.log('비/회원 잘못된 쿠키 정보 처리');
      await forceLogout(req);
      // 잘못된 접근
      url.pathname = '/auth/login';
      url.search = `redirect=${encodeURIComponent(redirect)}&action=view`;
      return NextResponse.redirect(url);
    }

    // console.log('비회원 검증');
    // 비회원
    if (isMemberPath(pathname)) {
      url.pathname = '/auth/login';
      url.search = `redirect=${encodeURIComponent(redirect)}&action=view`;
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // console.log('회원 검증');

  const verifiedSession = await verifySession(req);
  // console.log('🚀 ~ middleware ~ verifiedSession:', verifiedSession);

  if ((verifiedSession && isGuestPath(pathname)) || pathname === '/') {
    url.pathname = '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
