import { useCallback } from 'react';

export const useErrorHandler = () => {
  console.log('useErrorHandler');
  const handleError = useCallback((error: Error) => {
    console.error('callback:', error);
  }, []);

  return { handleError };
};
