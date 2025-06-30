'use client';

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';
import { useErrorHandler } from './useErrorHandler';

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { handleError } = useErrorHandler();
  const client = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError: handleError,
          },
        },
        queryCache: new QueryCache({
          onError: handleError,
        }),
      }),
    [handleError],
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
