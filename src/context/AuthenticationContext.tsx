'use client';

import { GetMeResponse } from '@/models/GetMeResponse';
import { useAuthStore } from '@/store/auth.store';
import { useLoading } from '@hooks/useLoading';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Fragment, useEffect } from 'react';

const AuthenticationProvider = ({ children, user, initialize }: { children: React.ReactNode; user: GetMeResponse | null; initialize: boolean }) => {
  useLoading();
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
  }, []);

  return (
    <Fragment>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        {children}
      </LocalizationProvider>
    </Fragment>
  );
};

export default AuthenticationProvider;
