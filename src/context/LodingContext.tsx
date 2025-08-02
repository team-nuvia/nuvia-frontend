'use client';

import { GetMeResponse } from '@/models/GetMeResponse';
import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useState } from 'react';
import { AuthenticationContext } from './AuthenticationContext';

export const LoadingContext = createContext({
  loading: true,
  startLoading: (loadingText?: string) => {},
  endLoading: () => {},
});

const routerMap: (pathname: string, user: GetMeResponse | null) => string = (pathname: string, user: GetMeResponse | null) => {
  if (/^\/$/.test(pathname)) return user ? '대시보드 로드 중...' : '서비스 로드 중...';
  if (/^\/auth\/login$/.test(pathname)) return '로그인 페이지 로드 중...';
  if (/^\/auth\/signup$/.test(pathname)) return '회원가입 페이지 로드 중...';
  if (/^\/auth\/reset-password$/.test(pathname)) return '비밀번호 재설정 페이지 로드 중...';
  if (/^\/survey\/create$/.test(pathname)) return '설문 페이지 로드 중...';
  if (/^\/survey\/list$/.test(pathname)) return '설문 목록 로드 중...';
  if (/^\/survey\/(\d+)$/.test(pathname)) return '설문 상세 페이지 로드 중...';
  return '서비스 로드 중...';
};

interface LoadingProviderProps {
  children: React.ReactNode;
}
export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const { user } = useContext(AuthenticationContext);
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState(routerMap(pathname, user));

  const startLoading = useCallback(
    (loadingText?: string) => {
      setLoadingText(loadingText || '서비스 로드 중...');
      setLoading(true);
    },
    [setLoadingText, setLoading],
  );

  const endLoading = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <LoadingContext.Provider value={{ loading, startLoading, endLoading }}>
      <Stack flex={1} sx={{ position: 'relative' }}>
        {children}
      </Stack>
      {loading && (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{
            background: (theme) => theme.palette.background.paper,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <LinearProgress sx={{ width: 200, mb: 2 }} />
              <Typography color="text.secondary">{loadingText}</Typography>
            </Box>
          </Box>
        </Stack>
      )}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
