'use client';

import { useAuthStore } from '@/store/auth.store';
import { useSnackbar, VariantType } from 'notistack';
import { createContext, useCallback, useEffect } from 'react';

export const GlobalSnackbarContext = createContext<{
  addNotice: (message: string, variant?: VariantType) => void;
}>({
  addNotice: () => {},
});

export const GlobalSnackbar = ({ children }: { children: React.ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();
  const setAddNotice = useAuthStore((state) => state.actions.setAddNotice);

  const addNotice = useCallback((message: string, variant: VariantType = 'default') => {
    enqueueSnackbar(message, {
      variant,
      // preventDuplicate: false,
      // style: { zIndex: 100000 },
      // autoHideDuration: 3000,
      // anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      // transitionDuration: 150,
    });
  }, []);

  useEffect(() => {
    setAddNotice(addNotice);
  }, []);

  return <GlobalSnackbarContext.Provider value={{ addNotice }}>{children}</GlobalSnackbarContext.Provider>;
};
