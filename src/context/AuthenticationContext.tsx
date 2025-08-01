'use client';

import { GetMeResponse } from '@/models/GetMeResponse';
import { getUsersMe } from '@api/get-users-me';
import { getVerify } from '@api/get-verify';
import { logout } from '@api/logout';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AxiosError } from 'axios';
import { createContext, useCallback, useEffect, useState } from 'react';

interface AuthenticationContextType {
  user: GetMeResponse | null;
  setUser: (user: GetMeResponse | null) => void;
  clearUser: () => Promise<void>;
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

  const fetchUser = useCallback(async () => {
    try {
      const response = await getVerify();
      if (response.ok && response.payload?.verified) {
        const response = await getUsersMe();
        if (response.ok) {
          setUser(response.payload);
        }
      } else {
        await clearUser();
      }
    } catch (error) {
      if (error instanceof AxiosError && error.code === 'ERR_BAD_RESPONSE') {
        console.error('AuthenticationContext fetchUser error', error);
      } else {
        await clearUser();
      }
    }
  }, []);

  const clearUser = useCallback(async () => {
    await logout();
    setUser(null);
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
