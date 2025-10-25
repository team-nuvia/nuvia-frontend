import { API_URL } from '@common/variables';
import { isGuestPath, isMemberPath } from '@util/guard';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { CookieNameType } from '../share/enums/cookie-name-type';

async function setCookies(result: Response) {
  const cookieList = result.headers.getSetCookie() ?? [];
  for (const cookie of cookieList) {
    const [main, ...cookieRows] = cookie.split(';').map((keyValue) => keyValue.trim().split('='));
    const parsedCookie = Object.fromEntries(cookieRows.map(([key, value]) => [key, value]));
    const cookieStore = await cookies();
    const cookieData: ResponseCookie = {
      name: main[0],
      value: main[1] ?? '',
      path: parsedCookie.Path ?? '/',
      secure: (parsedCookie.Secure as unknown as boolean) ?? false,
      expires: new Date(parsedCookie.Expires).getTime(),
      sameSite: (parsedCookie.SameSite as unknown as boolean) ?? 'Lax',
      httpOnly: 'HttpOnly' in parsedCookie,
      domain: parsedCookie.Domain ?? '',
    };
    cookieStore.set(cookieData);
  }
}

async function clearCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(CookieNameType.Session);
  cookieStore.delete(CookieNameType.Access);
  cookieStore.delete(CookieNameType.Refresh);
}

async function forceLogout(url: URL) {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await clearCookie();
    if (!url.pathname.startsWith('/auth/login')) {
      url.search = `redirect=${encodeURIComponent(url.pathname)}&action=view`;
    }
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  } catch (error: any) {
    console.log('🚀 ~ forceLogout ~ error:', error.message);
    await clearCookie();
    if (!url.pathname.startsWith('/auth/login')) {
      url.search = `redirect=${encodeURIComponent(url.pathname)}&action=view&reason=server_error`;
    }
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }
}

async function verifySession(req: NextRequest, res: NextResponse, url: URL): Promise<{ verified: boolean } | string | null> {
  try {
    const response = await fetch(`${API_URL}/auth/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.cookies.toString(),
      },
    });
    const data = await response.json();
    return data.payload;
  } catch (error: any) {
    console.log('🚀 ~ verifySession ~ error:', error.message);
    if (error instanceof Error && error.message?.includes('Network Error')) {
      return 'SERVER_ERROR';
    }
    // await forceLogout(url);
    return null;
  }
}

async function getRefreshToken(req: NextRequest) {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.cookies.toString(),
      },
    });
    const data = await response.json();
    await setCookies(response);
    return data.payload;
  } catch (error: any) {
    console.log('🚀 ~ getRefreshToken ~ error:', error.message);
    if (error instanceof Error && error.message?.includes('Network Error')) {
      throw new Error('SERVER_ERROR');
    }
    throw error;
  }
}

export async function middleware(req: NextRequest, res: NextResponse) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();
  const cookieStore = await cookies();

  // 세션 쿠키(예: 'session' 또는 'access_token') 존재 여부만 빠르게 체크
  const accessToken = cookieStore.get(CookieNameType.Access)?.value;
  const session = cookieStore.get(CookieNameType.Session)?.value;
  const refreshToken = cookieStore.get(CookieNameType.Refresh)?.value;
  const redirect = url.pathname;

  if (!accessToken || !session || !refreshToken) {
    // 비회원
    if (isMemberPath(pathname)) {
      // 잘못된 접근
      if (!url.pathname.startsWith('/auth/login')) {
        url.search = `redirect=${encodeURIComponent(redirect)}&action=view`;
      }
      url.pathname = '/auth/login';
      return forceLogout(url);
    }

    return NextResponse.next();
  }

  let verifiedSessionStatus = null;

  try {
    const verifiedSession = await verifySession(req, res, url);

    if (verifiedSession === 'SERVER_ERROR') {
      if (!url.pathname.startsWith('/auth/login')) {
        url.search = `redirect=${encodeURIComponent(redirect)}&action=view&reason=server_error`;
      }
      url.pathname = '/auth/login';
      await clearCookie();
      return NextResponse.redirect(url);
    }

    if (verifiedSession === null) {
      return forceLogout(url);
    }

    if ((verifiedSession as { verified: boolean })?.verified && isGuestPath(pathname)) {
      url.pathname = '/dashboard';
      url.search = '';
      return NextResponse.redirect(url);
    }
  } catch (error: any) {
    console.log('🚀 ~ middleware ~ error:', error.message);
    verifiedSessionStatus = error.response?.status;
  }

  if (verifiedSessionStatus !== null) {
    try {
      await getRefreshToken(req);
    } catch (error: any) {
      console.log('🚀 ~ middleware ~ error:', error.message);
      if (error instanceof Error && error.message === 'SERVER_ERROR') {
        // 서버 연결 실패 시 로그인 페이지로 리다이렉트
        if (!url.pathname.startsWith('/auth/login')) {
          url.search = `redirect=${encodeURIComponent(redirect)}&action=view&reason=server_error`;
        }
        url.pathname = '/auth/login';
        await clearCookie();
        return NextResponse.redirect(url);
      }

      if (!url.pathname.startsWith('/auth/login')) {
        url.search = `redirect=${encodeURIComponent(redirect)}&action=view`;
      }
      url.pathname = '/auth/login';
      return await forceLogout(url);
      // return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
