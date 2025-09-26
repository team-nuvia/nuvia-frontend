'use client';

import { useAuthStore } from '@/store/auth.store';
import ActionButton from '@components/atom/ActionButton';
import { ArrowBack, Home, SearchOff } from '@mui/icons-material';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

interface NotFoundProps {}
const NotFound: React.FC<NotFoundProps> = () => {
  const router = useRouter();
  const mainUrl = useAuthStore((state) => state.mainUrl);

  return (
    <Stack
      flex={1}
      alignItems="center"
      justifyContent="center"
      spacing={5}
      sx={{
        minHeight: '70vh',
        textAlign: 'center',
        px: 3,
        py: 8,
      }}
    >
      {/* 아이콘 영역 */}
      <Paper
        elevation={0}
        sx={{
          width: 140,
          height: 140,
          borderRadius: 4,
          backgroundColor: 'primary.50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid',
          borderColor: 'primary.100',
        }}
      >
        <SearchOff
          sx={{
            fontSize: '4rem',
            color: 'primary.main',
            opacity: 0.8,
          }}
        />
      </Paper>

      {/* 메인 콘텐츠 */}
      <Stack spacing={3} sx={{ maxWidth: 480 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontSize: { xs: '1.75rem', sm: '2.25rem' },
            mb: 1,
          }}
        >
          찾으시는 페이지가 없어요
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            lineHeight: 1.7,
            fontSize: '1.1rem',
            fontWeight: 400,
          }}
        >
          페이지가 이동되었거나 삭제되었을 수 있습니다.
          <br />
          주소를 다시 확인하거나 아래 버튼으로 이동해 보세요.
        </Typography>
      </Stack>

      {/* 액션 버튼 그룹 */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 5, width: '100%', maxWidth: 400 }}>
        <ActionButton
          onClick={() => router.push(mainUrl)}
          startIcon={<Home />}
          sx={{
            px: 5,
            py: 2,
            borderRadius: 3,
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          }}
        >
          홈으로 가기
        </ActionButton>
        <ActionButton
          onClick={() => router.back()}
          variant="outlined"
          startIcon={<ArrowBack />}
          sx={{
            px: 5,
            py: 2,
            borderRadius: 3,
            fontWeight: 600,
            fontSize: '1rem',
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              backgroundColor: 'primary.50',
            },
          }}
        >
          이전으로
        </ActionButton>
      </Stack>

      {/* 추가 도움말 */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            fontSize: '0.875rem',
          }}
        >
          문제가 계속되면 고객지원팀에 문의해 주세요
        </Typography>
      </Box>
    </Stack>
  );
};

export default NotFound;
