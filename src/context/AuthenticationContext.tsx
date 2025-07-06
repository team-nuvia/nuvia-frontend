'use client';

import useUsersMe from '@hooks/getUsersMe';
import { IUser } from '@share/interface/iuser';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createContext, useEffect, useState } from 'react';

interface AuthenticationContextType {
  user: IUser | null;
}

const AuthenticationContext = createContext<AuthenticationContextType>({
  user: null,
});

const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const { data } = useUsersMe();

  useEffect(() => {
    console.log(data);
    if (data) {
      setUser(data);
    }
  }, []);

  return (
    <AuthenticationContext.Provider value={{ user }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        {children}
      </LocalizationProvider>
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
