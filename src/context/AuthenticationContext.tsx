'use client';

import { GetMeResponse } from '@/models/GetMeResponse';
import { getUsersMe } from '@api/get-users-me';
import { getVerify } from '@api/get-verify';
import { logout } from '@api/logout';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useEffect, useState } from 'react';

interface AuthenticationContextType {
  user: GetMeResponse | null;
  isUserLoading: boolean;
  mainUrl: string;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
}

export const AuthenticationContext = createContext<AuthenticationContextType>({
  user: null,
  isUserLoading: false,
  mainUrl: '/',
  clearUser: () => {},
  fetchUser: async () => {},
});

const AuthenticationProvider = ({ children, user, initialize }: { children: React.ReactNode; user: GetMeResponse | null; initialize: boolean }) => {
  const [mainUrl, setMainUrl] = useState('/');
  const [userData, setUserData] = useState<GetMeResponse | null>(user);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: getUsersMeMutation } = useMutation({
    mutationFn: () => getUsersMe(),
    mutationKey: ['getUsersMe'],
    onSuccess: (data) => {
      setUserData(data.payload);
      setIsUserLoading(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
        localStorage.removeItem('access_token');
        router.push('/');
      }
      setIsUserLoading(false);
    },
  });
  const { mutate: verifyToken } = useMutation({
    mutationKey: ['verifyToken'],
    mutationFn: () => getVerify(),
    onSuccess: async (data) => {
      if (data.ok && data.payload?.verified) {
        getUsersMeMutation();
      }
    },
    onError: async (error) => {
      if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
        logoutMutation();
      }
      setIsUserLoading(false);
    },
  });
  const { mutate: logoutMutation } = useMutation({
    mutationFn: () => logout(),
    mutationKey: ['logout'],
    onSuccess: () => {
      router.push('/');
      // verifyToken();
      setUserData(null);
      setIsUserLoading(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
        localStorage.removeItem('access_token');
      }
      setIsUserLoading(false);
    },
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return;

    if (initialize) {
      setIsUserLoading(true);
      verifyToken();
    }
  }, [pathname, initialize]);

  useEffect(() => {
    if (userData) {
      setMainUrl('/dashboard');
    } else {
      setMainUrl('/');
    }
  }, [userData]);

  const fetchUser = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      setIsUserLoading(true);

      const hasAccessToken = localStorage.getItem('access_token');
      const noAccessToken = !hasAccessToken || hasAccessToken === 'undefined';

      if (noAccessToken) {
        localStorage.removeItem('access_token');
        setIsUserLoading(false);
        resolve();
        return;
      }

      verifyToken(undefined, {
        onSuccess: () => {
          console.log('verify token success!!!');
          setIsUserLoading(false);
          resolve();
        },
        onError: () => {
          setIsUserLoading(false);
          reject();
        },
      });
    });
  }, []);

  const clearUser = useCallback(() => {
    logoutMutation();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ user: userData, clearUser, fetchUser, isUserLoading, mainUrl }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        {children}
      </LocalizationProvider>
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
