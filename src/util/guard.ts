export const PUBLIC_PATHS = [
  '/',
  '/invitation',
  '/howtouse',
  '/pricing',
  '/privacy-policy',
  '/terms-of-service',
  '/about',
  //
];
export const GUEST_PATHS = ['/auth/login', '/auth/signup', '/auth/forgot-password'];
export const MEMBER_PATHS = ['/dashboard'];

export function isPublicPath(pathname: string) {
  return pathname && PUBLIC_PATHS.some((publicPath) => publicPath === pathname || pathname.startsWith(publicPath));
}

export function isGuestPath(pathname: string) {
  console.log('🚀 ~ isGuestPath ~ pathname:', pathname);
  return pathname && (pathname === '/' || GUEST_PATHS.some((guestPath) => guestPath === pathname || pathname.startsWith(guestPath)));
}

export function isMemberPath(pathname: string) {
  return pathname && MEMBER_PATHS.some((memberPath) => memberPath === pathname || pathname.startsWith(memberPath));
}
