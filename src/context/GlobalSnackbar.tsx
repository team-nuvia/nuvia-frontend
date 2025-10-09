'use client';

import { useAuthStore } from '@/store/auth.store';
import { useSnackbar, VariantType } from 'notistack';
import { createContext, useCallback, useEffect, useMemo } from 'react';

export const GlobalSnackbarContext = createContext<{
  addNotice: (message: string, variant?: VariantType) => void;
}>({
  addNotice: () => {},
});

export const GlobalSnackbar = ({ children }: { children: React.ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar();
  const setAddNotice = useAuthStore((state) => state.actions.setAddNotice);

  const addNotice = useCallback(
    (message: string, variant: VariantType = 'default') => {
      enqueueSnackbar(message, { variant });
    },
    [enqueueSnackbar],
  );

  useEffect(() => {
    setAddNotice(addNotice);
  }, [addNotice, setAddNotice]);

  const contextValue = useMemo(() => ({ addNotice }), [addNotice]);

  return <GlobalSnackbarContext.Provider value={contextValue}>{children}</GlobalSnackbarContext.Provider>;
};
