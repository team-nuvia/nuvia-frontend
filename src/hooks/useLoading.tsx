import { useAuthStore } from '@/store/auth.store';
import LoadingContext from '@context/LoadingContext';
import { useContext, useEffect, useState } from 'react';

export const useLoading = () => {
  const isUserLoading = useAuthStore((state) => state.isUserLoading);
  const { endLoading } = useContext(LoadingContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (isUserLoading) return;

    endLoading();
  }, [isMounted, isUserLoading]);
};
