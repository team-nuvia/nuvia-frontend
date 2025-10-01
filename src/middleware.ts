import axios, { AxiosResponse } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_URL } from '@common/variables';
import { isGuestPath, isMemberPath } from '@util/guard';

async function setCookies(result: AxiosResponse) {
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

async function forceLogout(url: URL) {
  try {
    const result = await axios.post(`${API_URL}/auth/logout`, undefined, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await setCookies(result);
    if (!url.pathname.startsWith('/auth/login')) {
      url.search = `redirect=${encodeURIComponent(url.pathname)}&action=view`;
    }
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  } catch (error) {
    console.log('🚀 ~ forceLogout ~ error:', error);
    const cookieStore = await cookies();
    cookieStore.delete('session');
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    if (!url.pathname.startsWith('/auth/login')) {
      url.search = `redirect=${encodeURIComponent(url.pathname)}&action=view&reason=server_error`;
    }
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }
}

async function verifySession(req: NextRequest, res: NextResponse, url: URL): Promise<string | null> {
  try {
    const response = await axios.post(`${API_URL}/auth/session`, undefined, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.cookies.toString(),
      },
    });
    return response.data.payload;
  } catch (error) {
    if (error instanceof Error && error.message?.includes('Network Error')) {
      return 'SERVER_ERROR';
    }
    // await forceLogout(url);
    return null;
  }
}

async function getRefreshToken(req: NextRequest) {
  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, undefined, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.cookies.toString(),
      },
    });
    await setCookies(response);
    return response.data.payload;
  } catch (error) {
    if (error instanceof Error && error.message?.includes('Network Error')) {
      throw new Error('SERVER_ERROR');
    }
    // await forceLogout(url);
    throw error;
  }
}

export async function middleware(req: NextRequest, res: NextResponse) {
  const { pathname } = req.nextUrl;
  console.log('🚀 ~ middleware ~ pathname:', pathname);
  const url = req.nextUrl.clone();
  const cookieStore = await cookies();

  // 세션 쿠키(예: 'session' 또는 'access_token') 존재 여부만 빠르게 체크
  const session = cookieStore.get('session')?.value;
  console.log('🚀 ~ middleware ~ session:', session);
  const refreshToken = cookieStore.get('refresh_token')?.value;
  console.log('🚀 ~ middleware ~ refreshToken:', refreshToken);
  const redirect = url.pathname;

  if (!session && !refreshToken) {
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
  } else {
    // 리프레시
    try {
      await getRefreshToken(req);
    } catch (error) {
      if (error instanceof Error && error.message === 'SERVER_ERROR') {
        if (!url.pathname.startsWith('/auth/login')) {
          url.search = `redirect=${encodeURIComponent(redirect)}&action=view&reason=server_error`;
        }
        url.pathname = '/auth/login';
        return forceLogout(url);
      }
      throw error;
    }
  }

  let verifiedSessionStatus = null;

  try {
    const verifiedSession = await verifySession(req, res, url);

    if (verifiedSession === 'SERVER_ERROR') {
      if (!url.pathname.startsWith('/auth/login')) {
        url.search = `redirect=${encodeURIComponent(redirect)}&action=view&reason=server_error`;
      }
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }

    if (verifiedSession === null) {
      return forceLogout(url);
    }

    if (verifiedSession && (isGuestPath(pathname) || pathname === '/')) {
      url.pathname = '/dashboard';
      url.search = '';
      return NextResponse.redirect(url);
    }
  } catch (error: any) {
    verifiedSessionStatus = error.response.status;
  }

  if (verifiedSessionStatus !== null) {
    try {
      await getRefreshToken(req);
    } catch (error) {
      if (error instanceof Error && error.message === 'SERVER_ERROR') {
        // 서버 연결 실패 시 로그인 페이지로 리다이렉트
        if (!url.pathname.startsWith('/auth/login')) {
          url.search = `redirect=${encodeURIComponent(redirect)}&action=view&reason=server_error`;
        }
        url.pathname = '/auth/login';
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
