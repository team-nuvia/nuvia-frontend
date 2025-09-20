'use client';

import { GetMeResponse } from '@/models/GetMeResponse';
import { getUsersMe } from '@api/get-users-me';
import { getVerify } from '@api/get-verify';
import { getVerifySession } from '@api/get-verify-session';
import { logout } from '@api/logout';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { GlobalSnackbarContext } from './GlobalSnackbar';
import { useBlackRouter } from '@hooks/useBlackRouter';
import { useLoading } from '@hooks/useLoading';

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
  useLoading();
  const { addNotice } = useContext(GlobalSnackbarContext);
  const [mainUrl, setMainUrl] = useState('/');
  const [userData, setUserData] = useState<GetMeResponse | null>(user);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const pathname = usePathname();
  const router = useBlackRouter();
  const { mutate: getUsersMeMutation } = useMutation({
    mutationFn: () => getUsersMe(),
    mutationKey: ['getUsersMe'],
    onSuccess: (data) => {
      setUserData(data.payload);
      setIsUserLoading(false);
      setMainUrl('/dashboard');
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
        localStorage.removeItem('access_token');
        logoutMutation();
      }
      setIsUserLoading(false);
    },
  });
  const { mutate: verifySessionMutation } = useMutation({
    mutationKey: ['verifySession'],
    mutationFn: () => getVerifySession(),
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
  const { mutate: verifyToken } = useMutation({
    mutationKey: ['verifyToken'],
    mutationFn: () => getVerify(),
    onSuccess: async (data) => {
      if (data.ok && data.payload?.verified) {
        verifySessionMutation();
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
    onSuccess: (data) => {
      // verifyToken();
      setUserData(null);
      setMainUrl('/');
      setIsUserLoading(false);
      router.push('/');
      addNotice(data.message, 'success');
    },
    onError: (error: AxiosError<ServerResponse<any>>) => {
      if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
        localStorage.removeItem('access_token');
      }
      setIsUserLoading(false);
      addNotice(error.response?.data.message ?? '로그아웃 중 오류가 발생했습니다. 관리자에게 문의해주세요.', 'error');
    },
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (initialize) {
      if (accessToken) verifyToken();
      setIsUserLoading(true);
    }
  }, [pathname, initialize]);

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
