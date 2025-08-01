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
    enqueueSnackbar(message, { variant, preventDuplicate: true, style: { zIndex: 100000 } });
  };

  return <GlobalSnackbarContext.Provider value={{ addNotice }}>{children}</GlobalSnackbarContext.Provider>;
};
