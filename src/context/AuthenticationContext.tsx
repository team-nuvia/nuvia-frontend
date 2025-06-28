'use client';

import useUsersMe from '@hooks/getUsersMe';
import { IUser } from '@models/iuser';
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
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
