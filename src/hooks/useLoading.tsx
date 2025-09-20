import { AuthenticationContext } from '@context/AuthenticationContext';
import LoadingContext from '@context/LoadingContext';
import { useContext, useEffect, useState } from 'react';

export const useLoading = () => {
  const { isUserLoading } = useContext(AuthenticationContext);
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
