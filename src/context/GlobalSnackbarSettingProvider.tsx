'use client';

import { SnackbarProvider } from 'notistack';
import { createContext, useMemo, useState } from 'react';

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

  const contextValue = useMemo(() => ({ maxSnack, setMaxSnack }), [maxSnack]);

  return (
    <SnackbarContext.Provider value={contextValue}>
      <SnackbarProvider
        maxSnack={maxSnack ?? 3}
        preventDuplicate={false}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transitionDuration={150}
      >
        {children}
      </SnackbarProvider>
    </SnackbarContext.Provider>
  );
};
