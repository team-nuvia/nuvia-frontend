'use client';

import { GetMeResponse } from '@/models/GetMeResponse';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';

const AuthenticationProvider = ({ user, initialize }: { user: GetMeResponse | null; initialize: boolean }) => {
  const setUser = useAuthStore((state) => state.actions.setUser);
  const setIsUserLoading = useAuthStore((state) => state.actions.setIsUserLoading);
  const setMainUrl = useAuthStore((state) => state.actions.setMainUrl);

  useEffect(() => {
    // set user
    if (initialize) {
      if (user) {
        setUser(user);
        setIsUserLoading(false);
        setMainUrl('/dashboard');
      } else {
        setUser(null);
        setIsUserLoading(false);
        setMainUrl('/');
      }
    }
  }, [user, initialize]);

  return null;
};

export default AuthenticationProvider;
