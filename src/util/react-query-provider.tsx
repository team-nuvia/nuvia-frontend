'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  // const { handleError } = useErrorHandler();
  // const client = useMemo(
  //   () =>
  //     new QueryClient({
  //       defaultOptions: {
  //         mutations: {
  //           onError: handleError,
  //         },
  //       },
  //       // queryCache: new QueryCache({
  //       //   onError: handleError,
  //       // }),
  //     }),
  //   [handleError],
  // );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
