export const PUBLIC_PATHS = [
  '/',
  '/invitation',
  '/howtouse',
  '/pricing',
  '/privacy',
  '/terms',
  '/about',
  //
];
export const GUEST_PATHS = ['/auth/login', '/auth/signup', '/auth/forgot-password'];
export const MEMBER_PATHS = ['/dashboard', '/user', '/notifications'];

/* TODO: 경로 "/"일 경우 제외하고는 패스가 시작하는 경로와 매칭되는지 검증해야한다. */
export function isPublicPath(pathname: string) {
  return (
    pathname &&
    PUBLIC_PATHS.some((publicPath) => (pathname.length === 1 ? publicPath === pathname : publicPath === pathname || pathname.startsWith(publicPath)))
  );
}

export function isGuestPath(pathname: string) {
  return (
    pathname &&
    GUEST_PATHS.some((guestPath) => (pathname.length === 1 ? guestPath === pathname : guestPath === pathname || pathname.startsWith(guestPath)))
  );
}

export function isMemberPath(pathname: string) {
  return (
    pathname &&
    MEMBER_PATHS.some((memberPath) => (pathname.length === 1 ? memberPath === pathname : memberPath === pathname || pathname.startsWith(memberPath)))
  );
}
