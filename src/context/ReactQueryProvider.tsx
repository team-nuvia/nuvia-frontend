'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 간주
      gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
      refetchOnWindowFocus: true, // 윈도우 포커스 시 자동 리페치 비활성화
      retry: (failureCount, error: any) => {
        // 401 에러는 재시도하지 않음
        if (error?.response?.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false, // 뮤테이션은 재시도하지 않음
    },
  },
});

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
