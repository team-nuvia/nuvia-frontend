import { useAuthStore } from '@/store/auth.store';
import LoadingContext from '@context/LoadingContext';
import { isGuestPath, isMemberPath } from '@util/guard';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

export const useLoading = () => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const router = useAuthStore((state) => state.router)!;
  const isUserLoading = useAuthStore((state) => state.isUserLoading);
  const { endLoading } = useContext(LoadingContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (isUserLoading) return;

    endLoading();
  }, [isMounted, isUserLoading]);

  // useEffect(() => {
  //   if (!router) return;

  //   if (user) {
  //     if (isGuestPath(pathname)) {
  //       endLoading();
  //       router.push('/dashboard');
  //     }
  //   } else {
  //     if (isMemberPath(pathname)) {
  //       endLoading();
  //       router.push('/auth/login');
  //     }
  //   }
  // }, [pathname, user, router]);
};
