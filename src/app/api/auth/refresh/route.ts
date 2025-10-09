import { NextResponse } from 'next/server';
import { cookies as requestCookies } from 'next/headers';
import { API_URL } from '@/common/variables';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function POST() {
  const cookieStore = await requestCookies();
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { cookie: cookieStore.toString() },
    cache: 'no-store',
  });

  const body = await res.text(); // (json이면 json()으로)
  const resp = new NextResponse(body, { status: res.status });
  const setCookies = res.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    const [main, ...cookieRows] = cookie.split(';').map((keyValue) => keyValue.trim().split('='));
    const parsedCookie = Object.fromEntries(cookieRows.map(([key, value]) => [key, value]));
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
  for (const sc of setCookies) resp.headers.append('Set-Cookie', sc);
  return resp;
}
