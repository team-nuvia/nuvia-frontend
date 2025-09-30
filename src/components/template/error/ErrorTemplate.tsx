'use client';

import ErrorBackground from '@/assets/ErrorBackground';
import { useAuthStore } from '@/store/auth.store';
import ActionButton from '@components/atom/ActionButton';
import ErrorSection from '@components/organism/ErrorSection';
import NotFoundSection from '@components/organism/NotFoundSection';
import OfflineSection from '@components/organism/OfflineSection';
import { ArrowBack, Home } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

type ErrorType = 'error' | 'not-found' | 'offline';

interface ErrorProps {
  type: ErrorType;
}
const ErrorTemplate: React.FC<ErrorProps> = ({ type }) => {
  const router = useRouter();
  const mainUrl = useAuthStore((state) => state.mainUrl);

  const errorSection = useCallback((type: ErrorType) => {
    if (type === 'error') {
      return <ErrorSection />;
    }
    if (type === 'not-found') {
      return <NotFoundSection />;
    }
    return <OfflineSection />;
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* 배경 이미지 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <ErrorBackground />
      </Box>

      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={4}
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          px: 3,
          py: 8,
          maxWidth: 600,
          width: '100%',
        }}
      >
        {/* 메인 콘텐츠 */}
        {errorSection(type)}

        {/* 액션 버튼 그룹 */}
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} sx={{ mt: 3 }}>
          {type === 'offline' ? (
            <ActionButton
              onClick={() => window.location.reload()}
              startIcon={<Home />}
              color="black"
              variant="contained"
              shape="rounded"
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                },
              }}
            >
              새로고침
            </ActionButton>
          ) : (
            <>
              <ActionButton
                onClick={() => router.push(mainUrl)}
                startIcon={<Home />}
                color="black"
                variant="contained"
                shape="rounded"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                  },
                }}
              >
                홈으로 가기
              </ActionButton>
              {type === 'not-found' && (
                <ActionButton
                  onClick={() => router.back()}
                  startIcon={<ArrowBack />}
                  shape="rounded"
                  color="black"
                  variant="outlined"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    borderWidth: 2,
                    backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)'),
                    },
                  }}
                >
                  이전으로
                </ActionButton>
              )}
            </>
          )}
        </Stack>

        {/* 추가 도움말 */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.disabled',
              fontSize: '0.8rem',
            }}
          >
            문제가 계속되면 고객지원팀에 문의해 주세요
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default ErrorTemplate;
