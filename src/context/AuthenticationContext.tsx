'use client';

import { GetMeResponse } from '@/models/GetMeResponse';
import { getUsersMe } from '@api/get-users-me';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createContext, useCallback, useEffect, useState } from 'react';

interface AuthenticationContextType {
  user: GetMeResponse | null;
  setUser: (user: GetMeResponse | null) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
}

export const AuthenticationContext = createContext<AuthenticationContextType>({
  user: null,
  setUser: () => {},
  clearUser: () => {},
  fetchUser: async () => {},
});

const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<GetMeResponse | null>(null);

  const fetchUser = useCallback(async () => {
    const response = await getUsersMe();
    if (response.ok) {
      setUser(response.payload);
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{ user, setUser, clearUser, fetchUser }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        {children}
      </LocalizationProvider>
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
