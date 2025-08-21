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
import { createContext, useCallback, useEffect, useState } from 'react';

interface AuthenticationContextType {
  user: GetMeResponse | null;
  setUser: (user: GetMeResponse | null) => void;
  clearUser: () => PromiseServerResponse<LogoutResponse>;
  fetchUser: () => Promise<void>;
}

export const AuthenticationContext = createContext<AuthenticationContextType>({
  user: null,
  setUser: () => {},
  clearUser: async () => {},
  fetchUser: async () => {},
});

const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<GetMeResponse | null>(null);
  const { mutate: verifyToken } = useMutation({
    mutationFn: () => getVerify(),
    onSuccess: async (data) => {
      if (data.ok && data.payload?.verified) {
        const response = await getUsersMe();
        setUser(response.payload);
      }
    },
    onError: async (error) => {
      if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
        await clearUser();
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

    verifyToken();
  }, []);

  const clearUser = useCallback(async () => {
    setUser(null);
    return await logout();
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ user, setUser, clearUser, fetchUser }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        {children}
      </LocalizationProvider>
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
