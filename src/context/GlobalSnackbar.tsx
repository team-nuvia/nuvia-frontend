'use client';

import { useSnackbar, VariantType } from 'notistack';
import { createContext } from 'react';

export const GlobalSnackbarContext = createContext<{
  addNotice: (message: string, variant?: VariantType) => void;
}>({
  addNotice: () => {},
});

export const GlobalSnackbar = ({ children }: { children: React.ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();

  const addNotice = (message: string, variant: VariantType = 'default') => {
    enqueueSnackbar(message, {
      variant,
      // preventDuplicate: false,
      // style: { zIndex: 100000 },
      // autoHideDuration: 3000,
      // anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      // transitionDuration: 150,
    });
  };

  return <GlobalSnackbarContext.Provider value={{ addNotice }}>{children}</GlobalSnackbarContext.Provider>;
};
