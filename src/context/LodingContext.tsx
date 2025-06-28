'use client';

import { createContext, useState } from 'react';

export const LoadingContext = createContext({
  loading: true,
  setLoading: (loading: boolean) => {},
});

interface LoadingProviderProps {
  children: React.ReactNode;
}
export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);

  const handleSetLoading = (loading: boolean) => {
    setLoading(loading);
  };

  return (
    <LoadingContext.Provider value={{ loading, setLoading: handleSetLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
