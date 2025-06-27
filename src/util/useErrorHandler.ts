import { useCallback } from 'react';

export const useErrorHandler = () => {
  const handleError = useCallback((error: Error) => {
    console.error(error);
  }, []);

  return { handleError };
};
