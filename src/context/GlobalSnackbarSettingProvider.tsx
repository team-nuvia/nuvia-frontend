'use client';

import { SnackbarProvider } from 'notistack';
import { createContext, useState } from 'react';

export interface SnackbarContextType {
  maxSnack: number;
  setMaxSnack: (max: number) => void;
}

export const SnackbarContext = createContext<SnackbarContextType>({
  maxSnack: 3,
  setMaxSnack: (max: number) => {},
});

export const GlobalSnackbarSettingProvider = ({ children }: { children: React.ReactNode }) => {
  const [maxSnack, setMaxSnack] = useState(3);

  return (
    <SnackbarContext.Provider value={{ maxSnack, setMaxSnack }}>
      <SnackbarProvider
        maxSnack={maxSnack ?? 3}
        preventDuplicate={false}
        style={{ zIndex: 100000 }}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transitionDuration={150}
      >
        {children}
      </SnackbarProvider>
    </SnackbarContext.Provider>
  );
};
