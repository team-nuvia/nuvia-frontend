import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

async function forceLogout() {
  const result = await axios.post(`${API_URL}/auth/logout`, undefined, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const cookieList = result.headers['set-cookie'] ?? [];
  for (const cookie of cookieList) {
    const [main, ...cookieRows] = cookie.split(';').map((keyValue) => keyValue.trim().split('='));
    const parsedCookie = Object.fromEntries(cookieRows);
    const cookieStore = await cookies();
    cookieStore.set({
      name: main[0],
      value: main[1],
      path: parsedCookie.Path,
      expires: new Date(parsedCookie.Expires).getTime(),
      sameSite: parsedCookie.SameSite,
      httpOnly: 'HttpOnly' in parsedCookie,
    });
  }
}

async function verifySession(req: NextRequest, res: NextResponse): Promise<string | null> {
  try {
    const response = await axios.post(`${API_URL}/auth/session`, undefined, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.cookies.toString(),
      },
    });
    return response.data.payload;
  } catch (error) {
    await forceLogout();
    return null;
  }
}

export async function middleware(req: NextRequest, res: NextResponse) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();
  const cookieStore = await cookies();

  // 세션 쿠키(예: 'session' 또는 'access_token') 존재 여부만 빠르게 체크
  const session = cookieStore.get('session')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;
  const redirect = url.pathname;

  if (!session) {
    if (!refreshToken && isMemberPath(pathname)) {
      await forceLogout();
      // 잘못된 접근
      url.pathname = '/auth/login';
      url.search = `redirect=${encodeURIComponent(redirect)}&action=view`;
      return NextResponse.redirect(url);
    }

    // 비회원
    if (isMemberPath(pathname)) {
      url.pathname = '/auth/login';
      url.search = `redirect=${encodeURIComponent(redirect)}&action=view`;
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  try {
    const verifiedSession = await verifySession(req, res);

    if (verifiedSession && (isGuestPath(pathname) || pathname === '/')) {
      url.pathname = '/dashboard';
      url.search = '';
      return NextResponse.redirect(url);
    }
  } catch (error) {
    url.pathname = '/auth/login';
    url.search = `redirect=${encodeURIComponent(redirect)}&action=view`;
    await forceLogout();
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
