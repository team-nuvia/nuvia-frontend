import axios, { AxiosResponse } from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@common/variables';
import { isGuestPath, isMemberPath } from '@util/guard';

function parseCookieString(cookieString: string) {
  const [nameValue, ...attributes] = cookieString.split(';').map((part) => part.trim());
  const [name, value] = nameValue.split('=');

  const parsed: Record<string, string> = { name, value };

  for (const attr of attributes) {
    const [key, val] = attr.split('=');
    parsed[key.toLowerCase()] = val || 'true';
  }

  return parsed;
}

function createSetCookieHeader(cookie: Record<string, string>): string {
  const { name, value, path, expires, samesite, httponly, secure } = cookie;

  let cookieString = `${name}=${value}`;

  if (path) cookieString += `; Path=${path}`;
  if (expires) cookieString += `; Expires=${expires}`;
  if (samesite) cookieString += `; SameSite=${samesite}`;
  if (httponly === 'true') cookieString += `; HttpOnly`;
  if (secure === 'true') cookieString += `; Secure`;

  return cookieString;
}

function setCookiesFromResponse(response: NextResponse, result: AxiosResponse) {
  const cookieList = result.headers['set-cookie'] ?? [];

  for (const cookieString of cookieList) {
    const parsedCookie = parseCookieString(cookieString);
    const setCookieHeader = createSetCookieHeader(parsedCookie);
    response.headers.append('Set-Cookie', setCookieHeader);
  }
}

async function forceLogout(url: URL, request?: NextRequest) {
  const response = NextResponse.redirect(url);

  try {
    if (request) {
      const result = await axios.post(`${API_URL}/auth/logout`, undefined, {
        headers: {
          'Content-Type': 'application/json',
          Cookie: request.cookies.toString(),
        },
      });
      setCookiesFromResponse(response, result);
    }

    if (!url.pathname.startsWith('/auth/login')) {
      url.search = `redirect=${encodeURIComponent(url.pathname)}&action=view`;
    }
    url.pathname = '/auth/login';

    return NextResponse.redirect(url, { headers: response.headers });
  } catch (error: any) {
    console.log('🚀 ~ forceLogout ~ error:', error);

    // 쿠키 삭제를 위해 Set-Cookie 헤더로 빈 값 설정
    response.headers.append('Set-Cookie', 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly');
    response.headers.append('Set-Cookie', 'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly');
    response.headers.append('Set-Cookie', 'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly');

    if (!url.pathname.startsWith('/auth/login')) {
      url.search = `redirect=${encodeURIComponent(url.pathname)}&action=view&reason=server_error`;
    }
    url.pathname = '/auth/login';

    return NextResponse.redirect(url, { headers: response.headers });
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
  } catch (error: any) {
    if (error instanceof Error && error.message?.includes('Network Error')) {
      return 'SERVER_ERROR';
    }
    return null;
  }
}

async function getRefreshToken(req: NextRequest): Promise<{ payload: any; response: NextResponse }> {
  const response = NextResponse.next();

  try {
    const result = await axios.post(`${API_URL}/auth/refresh`, undefined, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.cookies.toString(),
      },
    });

    setCookiesFromResponse(response, result);

    return {
      payload: result.data.payload,
      response,
    };
  } catch (error: any) {
    if (error instanceof Error && error.message?.includes('Network Error')) {
      throw new Error('SERVER_ERROR');
    }
    throw error;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log('🚀 ~ middleware ~ pathname:', pathname);
  const url = req.nextUrl.clone();

  // 세션 쿠키(예: 'session' 또는 'access_token') 존재 여부만 빠르게 체크
  const session = req.cookies.get('session')?.value;
  const refreshToken = req.cookies.get('refresh_token')?.value;
  const redirect = url.pathname;

  if (!session && !refreshToken) {
    // 비회원
    if (isMemberPath(pathname)) {
      // 잘못된 접근
      if (!url.pathname.startsWith('/auth/login')) {
        url.search = `redirect=${encodeURIComponent(redirect)}&action=view`;
      }
      url.pathname = '/auth/login';
      return forceLogout(url, req);
    }

    return NextResponse.next();
  }

  let verifiedSessionStatus: number | null = null;
  try {
    const verifiedSession = await verifySession(req, NextResponse.next(), url);

    if (verifiedSession === 'SERVER_ERROR') {
      if (!url.pathname.startsWith('/auth/login')) {
        url.search = `redirect=${encodeURIComponent(redirect)}&action=view&reason=server_error`;
      }
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }

    if (verifiedSession && (isGuestPath(pathname) || pathname === '/')) {
      url.pathname = '/dashboard';
      url.search = '';
      return NextResponse.redirect(url);
    }
  } catch (error: any) {
    verifiedSessionStatus = error.response?.status ?? null;
  }

  if (verifiedSessionStatus !== null) {
    try {
      const { response } = await getRefreshToken(req);
      return response;
    } catch (error: any) {
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
      return forceLogout(url, req);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

export const runtime = 'nodejs';
