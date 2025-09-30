import { Stack, Typography, Box } from '@mui/material';

interface ErrorSectionProps {}
const ErrorSection: React.FC<ErrorSectionProps> = () => {
  return (
    <Stack spacing={2} sx={{ maxWidth: 480 }}>
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
        500
      </Typography>

      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          mb: 2,
        }}
      >
        서버 오류가 발생했어요
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          lineHeight: 1.7,
          fontSize: '1rem',
          fontWeight: 400,
        }}
      >
        일시적인 서버 문제로 페이지를 불러올 수 없습니다.
        <br />
        잠시 후 다시 시도하거나 홈으로 이동해 보세요.
      </Typography>

      {/* 에러 디버그 정보 (개발 환경에서만 표시) */}
      {process.env.NODE_ENV === 'development' && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)'),
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            textAlign: 'left',
            border: (theme) => (theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.2)'),
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'error.main',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              wordBreak: 'break-all',
            }}
          >
            서버 연결에 문제가 발생했어요.
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default ErrorSection;
