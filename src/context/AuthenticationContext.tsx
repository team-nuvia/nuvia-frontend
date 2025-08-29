'use client';

import { GetMeResponse } from '@/models/GetMeResponse';
import { LogoutResponse } from '@/models/LogoutResponse';
import { getUsersMe } from '@api/get-users-me';
import { getVerify } from '@api/get-verify';
import { logout } from '@api/logout';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useLayoutEffect, useState } from 'react';

interface AuthenticationContextType {
  user: GetMeResponse | null;
  isLoading: boolean;
  isVerified: boolean;
  setUser: (user: GetMeResponse | null) => void;
  clearUser: () => PromiseServerResponse<LogoutResponse>;
  fetchUser: () => Promise<void>;
}

export const AuthenticationContext = createContext<AuthenticationContextType>({
  user: null,
  isLoading: false,
  isVerified: false,
  setUser: () => {},
  clearUser: async () => {},
  fetchUser: async () => {},
});

const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<GetMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const pathname = usePathname();
  const { mutate: verifyToken } = useMutation({
    mutationKey: ['verifyToken'],
    mutationFn: () => getVerify(),
    onSuccess: async (data) => {
      if (data.ok && data.payload?.verified) {
        const response = await getUsersMe();
        setUser(response.payload);
        setIsLoading(false);
        setIsVerified(true);
      }
    },
    onError: async (error) => {
      if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
        await clearUser();
      }
      setIsLoading(false);
      setIsVerified(false);
    },
  });
  const { mutate: logoutMutation } = useMutation({
    mutationFn: () => logout(),
    mutationKey: ['logout'],
    onSuccess: () => {
      setUser(null);
      verifyToken();
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
        localStorage.removeItem('access_token');
      }
    },
  });

  const fetchUser = useCallback(async () => {
    const hasAccessToken = localStorage.getItem('access_token');
    const noAccessToken = !hasAccessToken || hasAccessToken === 'undefined';

    if (noAccessToken) {
      localStorage.removeItem('access_token');
      return;
    }

    setIsLoading(true);
    setIsVerified(false);
    verifyToken();
  }, []);

  const clearUser = useCallback(async () => {
    setIsLoading(true);
    logoutMutation();
  }, [user]);

  useLayoutEffect(() => {
    fetchUser();
  }, [pathname]);

  return (
    <AuthenticationContext.Provider value={{ user, setUser, clearUser, fetchUser, isLoading, isVerified }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        {children}
      </LocalizationProvider>
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
