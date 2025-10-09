import { API_URL } from '@common/variables';
import { cookies } from 'next/headers';

function mergeCookies(existing: string, setCookies: string[]) {
  // existing: "a=1; b=2"
  const jar = new Map<string, string>();
  existing
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((kv) => {
      const [k, v] = kv.split('=');
      if (k) jar.set(k, v ?? '');
    });
  for (const sc of setCookies) {
    const [pair] = sc.split(';'); // "name=value"
    const [k, v] = pair.split('=');
    if (k) jar.set(k.trim(), v ?? '');
  }
  return Array.from(jar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

export async function getUserInformation() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has('session');
  const hasAccessToken = cookieStore.has('access_token');

  if (!hasSession || !hasAccessToken) {
    return null;
  }

  let cookieHeader = cookieStore.toString();

  const verifyRes = await fetch(`${API_URL}/auth/verify`, {
    method: 'POST',
    headers: { cookie: cookieHeader, 'cache-control': 'no-cache' },
    cache: 'no-store',
  });

  let userRes = await fetch(`${API_URL}/users/me`, {
    headers: { cookie: cookieHeader },
    cache: 'no-store',
  });

  if (userRes.status === 401) {
    // 1) 내부 프록시 호출 (브라우저에도 Set-Cookie 전달)
    const refreshRes = await fetch(
      `${process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : process.env.NEXT_PUBLIC_SITE_URL}/api/auth/refresh`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: { cookie: cookieHeader },
        credentials: 'include',
      },
    );

    // 2) 같은 서버 렌더 내 재시도용으로 수동 머지
    const setCookies = refreshRes.headers.getSetCookie?.() ?? [];
    cookieHeader = mergeCookies(cookieHeader, setCookies);

    userRes = await fetch(`${API_URL}/users/me`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });
  }

  if (!verifyRes.ok || !userRes.ok) return null;
  const userJson = await userRes.json();
  return userJson.payload;
}
