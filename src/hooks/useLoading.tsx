import { AuthenticationContext } from '@context/AuthenticationContext';
import LoadingContext from '@context/LoadingContext';
import { UserRole } from '@share/enums/user-role';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

export const useLoading = ({
  forUser = false,
  verifiedRoute,
  unverifiedRoute,
  guestRoute,
  ifRole,
}: { forUser?: boolean; verifiedRoute?: string; unverifiedRoute?: string; guestRoute?: string; ifRole?: [UserRole, string] } = {}) => {
  const router = useRouter();
  const { user } = useContext(AuthenticationContext);
  const { startLoading, endLoading } = useContext(LoadingContext);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (forUser) {
      if (!user) {
        if (unverifiedRoute) {
          setContentLoaded(false);
          router.push(unverifiedRoute);
        } else {
          setContentLoaded(true);
          endLoading();
        }
      } else {
        if (ifRole) {
          if (ifRole[0] === user?.role) {
            setContentLoaded(false);
            router.push(ifRole[1]);
          } else {
            setContentLoaded(true);
            endLoading();
          }
        } else {
          if (verifiedRoute) {
            setContentLoaded(false);
            router.push(verifiedRoute);
          } else {
            setContentLoaded(true);
            endLoading();
          }
        }
      }
    } else {
      if (guestRoute) {
        router.push(guestRoute);
      } else {
        setContentLoaded(true);
        endLoading();
      }
    }
  }, [isMounted, user, forUser]);

  return { startLoading, endLoading, contentLoaded };
};
