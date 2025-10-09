'use client';

import { useAuthStore } from '@/store/auth.store';
import mutationKeys from '@/store/lib/mutation-key';
import { getVerify } from '@api/auth/get-verify';
import { verifyInvitationToken } from '@api/auth/verify-invitation-token';
import ActionButton from '@components/atom/ActionButton';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon, Mail as MailIcon } from '@mui/icons-material';
import { Alert, Box, Card, CardContent, CircularProgress, Container, Fade, Stack, Typography, useTheme } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// 초대 승락 페이지 로직
// 1. 토큰 유효성 검증을 위해 서버에 요청
// 2. 로그인 상태 확인 후 미로그인 시 로그인 페이지로 리디렉션
// 3. 로그인 페이지에서는 쿼리 파라미터로 초대 토큰을 전달하여
//    로그인 완료 후 원래 초대 승락 프로세스를 계속 진행할 수 있도록 함
// 4. 로그인 후 돌아왔을 때 자동으로 초대 승락 처리를 진행
//
// 확장 가능한 로그인 후 처리 시스템:
// - 쿼리 파라미터로 'action=invitation&token=xxx' 형태로 전달
// - 로그인 완료 후 action 값에 따라 다른 후속 작업 실행 가능
// - 예: action=invitation -> 초대 승락, action=payment -> 결제 진행 등

interface InvitationProps {
  token: string;
}

type InvitationStatus = 'loading' | 'success' | 'error' | 'unauthorized';

const Invitation: React.FC<InvitationProps> = ({ token }) => {
  const pathname = usePathname();
  const routerURL = `/auth/login?action=invitation&token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(pathname)}`;
  const router = useAuthStore((state) => state.router)!;
  const mainUrl = useAuthStore((state) => state.mainUrl);
  const addNotice = useAuthStore((state) => state.addNotice)!;
  const theme = useTheme();
  const [status, setStatus] = useState<InvitationStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [timer, setTimer] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { mutate: verifyInvitationTokenMutate } = useMutation({
    mutationKey: mutationKeys.user.verifyInvitationToken(),
    mutationFn: () => verifyInvitationToken(token),
    onSuccess: async (data) => {
      if (data.ok && data.payload.verified) {
        setStatus('success');
        setErrorMessage('');
        addNotice(data.message ?? '초대를 수락했습니다.', 'success');
      }
    },
    onError: async (error: AxiosError<ServerResponse<{ verified: boolean }>>) => {
      if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
        console.error('초대 처리 중 오류 발생:', error);
        setStatus('error');
        setErrorMessage(error?.response?.data?.message ?? '초대 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        addNotice(error?.response?.data?.message ?? '초대 처리 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
      } else {
        if (error.response?.data?.httpStatus === 400) {
          setStatus('error');
          setErrorMessage(error?.response?.data?.message);
          addNotice(error?.response?.data?.message ?? '초대 처리 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        } else if (error.response?.data?.httpStatus === 404) {
          setStatus('error');
          if (error.response?.data.reason === 'invitee') {
            setErrorMessage(error?.response?.data?.message);
            addNotice(error?.response?.data?.message ?? '잘못된 토큰입니다. 다시 시도해주세요.', 'error');
          } else if (error.response?.data.reason === 'inviter') {
            setErrorMessage(error?.response?.data?.message ?? '잘못된 토큰입니다. 다시 시도해주세요.');
            addNotice(error?.response?.data?.message ?? '잘못된 토큰입니다. 다시 시도해주세요.', 'error');
          } else {
            setErrorMessage(error?.response?.data?.message ?? '잘못된 토큰입니다. 다시 시도해주세요.');
            addNotice(error?.response?.data?.message ?? '잘못된 토큰입니다. 다시 시도해주세요.', 'error');
          }
        }
      }
    },
  });
  const { mutate: verifyToken } = useMutation({
    mutationKey: mutationKeys.user.verifyToken(),
    mutationFn: () => getVerify(),
    onSuccess: async (data) => {
      if (data.ok && data.payload?.verified) {
        verifyInvitationTokenMutate();
      }
    },
    onError: async (error) => {
      if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
        console.error('초대 처리 중 오류 발생:', error);
        setStatus('error');
        setErrorMessage(error?.response?.data?.message ?? '초대 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        addNotice(error?.response?.data?.message ?? '초대 처리 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
      } else {
        setStatus('unauthorized');
        setErrorMessage('');
        addNotice('로그인이 필요합니다. 잠시 후 자동으로 로그인 페이지로 이동합니다.', 'info');
        let timeout = timer;
        timerRef.current = setInterval(() => {
          setTimer((timeout -= 1));
          if (timeout === 0) {
            if (timerRef.current) clearInterval(timerRef.current as NodeJS.Timeout);
            router.push(routerURL);
          }
        }, 1000);
      }
    },
  });

  useEffect(() => {
    verifyToken();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleRetry = () => {
    setErrorMessage('');
    setStatus('loading');
    verifyToken();
  };

  const handleLoginRedirect = () => {
    router.push(routerURL);
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Fade in timeout={300}>
            <Stack spacing={3} alignItems="center">
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MailIcon sx={{ fontSize: 24, color: theme.palette.primary.main }} />
                </Box>
              </Box>
              <Typography variant="h5" component="h1" fontWeight="medium">
                초대장 확인 중
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                초대를 확인하고 있습니다.
                <br />
                잠시만 기다려주세요.
              </Typography>
            </Stack>
          </Fade>
        );

      case 'success':
        return (
          <Fade in timeout={500}>
            <Stack spacing={3} alignItems="center">
              <CheckCircleIcon
                sx={{
                  fontSize: 64,
                  color: theme.palette.success.main,
                  filter: 'drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3))',
                }}
              />
              <Typography variant="h5" component="h1" fontWeight="medium">
                초대가 완료되었습니다!
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                성공적으로 팀에 참여하셨습니다.
                <br />
                이제 모든 기능을 사용하실 수 있습니다.
              </Typography>
              <ActionButton variant="contained" size="large" sx={{ mt: 2, borderRadius: 2, px: 4 }} onClick={() => (window.location.href = mainUrl)}>
                대시보드로 이동
              </ActionButton>
            </Stack>
          </Fade>
        );

      case 'unauthorized':
        return (
          <Fade in timeout={300}>
            <Stack spacing={3} alignItems="center">
              <MailIcon
                sx={{
                  fontSize: 64,
                  color: theme.palette.primary.main,
                  filter: 'drop-shadow(0 2px 4px rgba(25, 118, 210, 0.3))',
                }}
              />
              <Typography variant="h5" component="h1" fontWeight="medium">
                로그인이 필요합니다
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                초대를 승인하려면 먼저 로그인해주세요.
                <br />
                {timer}초 후 자동으로 로그인 페이지로 이동합니다.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <ActionButton variant="contained" size="large" sx={{ borderRadius: 2, px: 4 }} onClick={handleLoginRedirect}>
                  지금 로그인
                </ActionButton>
              </Stack>
            </Stack>
          </Fade>
        );

      case 'error':
        return (
          <Fade in timeout={300}>
            <Stack spacing={3} alignItems="center">
              <ErrorIcon
                sx={{
                  fontSize: 64,
                  color: theme.palette.error.main,
                  filter: 'drop-shadow(0 2px 4px rgba(244, 67, 54, 0.3))',
                }}
              />
              <Typography variant="h5" component="h1" fontWeight="medium">
                오류가 발생했습니다
              </Typography>
              <Alert
                severity="error"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    width: '100%',
                    textAlign: 'center',
                  },
                }}
              >
                {errorMessage}
              </Alert>
              <ActionButton variant="contained" size="large" sx={{ borderRadius: 2, px: 4 }} onClick={handleRetry}>
                다시 시도
              </ActionButton>
            </Stack>
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <Stack justifyContent="center" alignItems="center" py={4} flex={1}>
      <Container maxWidth="sm">
        <Card
          elevation={0}
          sx={{
            width: '100%',
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.paper,
          }}
        >
          <CardContent sx={{ p: 4 }}>{renderContent()}</CardContent>
        </Card>
      </Container>
    </Stack>
  );
};

export default Invitation;
