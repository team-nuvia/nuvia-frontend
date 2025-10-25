'use client';

import { useAuthStore } from '@/store/auth.store';
import { BRAND_NAME } from '@common/variables';
import ActionButton from '@components/atom/ActionButton';
import BrandHead from '@components/molecular/BrandHead';
import { Login, PersonAdd, Security } from '@mui/icons-material';
import { Alert, Box, Card, CardContent, Container, Stack, Typography, useTheme } from '@mui/material';

interface LoginRequiredProps {
  surveyTitle?: string;
  onLoginSuccess?: () => void;
}

const LoginRequired: React.FC<LoginRequiredProps> = ({ surveyTitle, onLoginSuccess }) => {
  const theme = useTheme();
  const router = useAuthStore((state) => state.router)!;

  const handleLogin = () => {
    // 현재 URL을 redirect 파라미터로 전달
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}&action=view`);
  };

  const handleSignup = () => {
    const currentPath = window.location.pathname + window.location.search;
    router.push(`/auth/signup?redirect=${encodeURIComponent(currentPath)}&action=view`);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Stack spacing={4} alignItems="center">
        {/* 브랜드 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <BrandHead
            title={BRAND_NAME}
            width={80}
            height={80}
            primaryColor={theme.palette.primary.main}
            secondaryColor={theme.palette.secondary.main}
            noRoute
          />
        </Box>

        {/* 메인 카드 */}
        <Card
          elevation={0}
          sx={{
            width: '100%',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              {/* 아이콘 */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'primary.50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid',
                  borderColor: 'primary.light',
                }}
              >
                <Security
                  sx={{
                    fontSize: '2.5rem',
                    color: 'primary.main',
                  }}
                />
              </Box>

              {/* 제목 */}
              <Typography variant="h4" fontWeight={700} color="text.primary">
                로그인이 필요합니다
              </Typography>

              {/* 설명 */}
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                설문 응답을 계속하려면 로그인이 필요합니다.
                {surveyTitle && (
                  <>
                    <br />
                    <strong>"{surveyTitle}"</strong> 설문의 응답 세션이 유지되어 있습니다.
                  </>
                )}
              </Typography>

              {/* 안내 알림 */}
              <Alert
                severity="info"
                variant="outlined"
                sx={{
                  width: '100%',
                  '& .MuiAlert-message': {
                    width: '100%',
                  },
                }}
              >
                <Typography variant="body2">
                  로그인 후 설문 응답을 이어서 진행할 수 있습니다.
                  <br />
                  기존 응답 내용은 보존됩니다.
                </Typography>
              </Alert>

              {/* 액션 버튼들 */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', mt: 2 }}>
                <ActionButton
                  onClick={handleLogin}
                  startIcon={<Login />}
                  variant="contained"
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                >
                  로그인하기
                </ActionButton>

                <ActionButton
                  onClick={handleSignup}
                  startIcon={<PersonAdd />}
                  variant="outlined"
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1rem',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    },
                  }}
                >
                  회원가입
                </ActionButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* 추가 도움말 */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="caption" color="text.disabled">
            계정이 없으신가요? 회원가입 후 설문에 참여하실 수 있습니다.
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default LoginRequired;
