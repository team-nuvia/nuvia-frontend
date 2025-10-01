'use client';

import { useAuthStore } from '@/store/auth.store';
import mutationKeys from '@/store/lib/mutation-key';
import { getCsrfToken } from '@api/auth/get-csrf-token';
import { resetPassword, ResetPasswordData } from '@api/auth/reset-password';
import { sendPasswordResetEmail } from '@api/auth/send-password-reset-email';
import { verifyResetPasswordToken } from '@api/auth/verify-reset-password-token';
import ActionButton from '@components/atom/ActionButton';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Fade,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { detectBrowser } from '@util/detectBrowser';
import { detectUserDevice } from '@util/detectUserDevice';
import { useFormik } from 'formik';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

// API 함수들 (가명으로 작성)
// const sendPasswordResetEmail = async (email: string) => {
//   // 실제 API 호출 로직
//   await new Promise((resolve) => setTimeout(resolve, 2000));
//   return { success: true, message: '비밀번호 재설정 이메일이 발송되었습니다.' };
// };

// const resetPassword = async (data: { email: string; password: string }) => {
//   // 실제 API 호출 로직
//   await new Promise((resolve) => setTimeout(resolve, 2000));
//   return { success: true, message: '비밀번호가 성공적으로 변경되었습니다.' };
// };

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 480,
  width: '100%',
  borderRadius: 16,
  boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  padding: '12px 32px',
  boxShadow: theme.palette.mode === 'dark' ? '0 4px 16px rgba(61, 90, 254, 0.3)' : '0 4px 16px rgba(61, 90, 254, 0.2)',
  '&:hover': {
    boxShadow: theme.palette.mode === 'dark' ? '0 6px 20px rgba(61, 90, 254, 0.4)' : '0 6px 20px rgba(61, 90, 254, 0.3)',
    transform: 'translateY(-1px)',
  },
  transition: 'all 0.2s ease-in-out',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
  },
}));

// 유효성 검사 스키마
const emailSchema = Yup.object({
  email: Yup.string().email('올바른 이메일 주소를 입력해주세요.').required('이메일 주소를 입력해주세요.'),
});

const tokenSchema = Yup.object({
  token: Yup.string().required('잘못된 접근입니다.'),
  otpToken: Yup.string().length(6).required('잘못된 접근입니다.'),
});

const passwordSchema = Yup.object({
  password: Yup.string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, '영문과 숫자를 포함해야 합니다.')
    .required('새 비밀번호를 입력해주세요.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호 확인을 입력해주세요.'),
  token: Yup.string().required('잘못된 접근입니다.'),
});

interface ForgotPasswordProps {}
const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const router = useAuthStore((state) => state.router)!;
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const steps = [
    {
      label: '이메일 확인',
      description: '가입하신 이메일 주소를 입력해주세요.',
    },
    {
      label: '토큰 검증',
      description: '토큰을 입력해주세요.',
    },
    {
      label: '새 비밀번호 설정',
      description: '새로운 비밀번호를 입력해주세요.',
    },
    {
      label: '완료',
      description: '비밀번호가 성공적으로 변경되었습니다.',
    },
  ];

  const { mutate: getCsrfTokenMutation } = useMutation({
    mutationKey: mutationKeys.auth.getCsrfToken(),
    mutationFn: () => getCsrfToken(),
    onSuccess: (data) => {
      emailFormik.setFieldValue('token', data.payload?.token);
    },
  });

  // 이메일 전송 mutation
  const emailMutation = useMutation({
    mutationKey: mutationKeys.user.forgotPassword(),
    mutationFn: ({ email, token }: { email: string; token: string }) => sendPasswordResetEmail(email, token),
    onSuccess: (data) => {
      setActiveStep(1);
      tokenFormik.setFieldValue('token', data.payload?.token);
      passwordFormik.setFieldValue('token', data.payload?.token);
    },
    onError: (error) => {
      console.error('이메일 전송 실패:', error);
    },
  });

  // 비밀번호 변경 mutation
  const verifyTokenMutation = useMutation({
    mutationKey: mutationKeys.user.resetPassword(),
    mutationFn: ({ token, otpToken }: { token: string; otpToken: string }) => verifyResetPasswordToken(token, otpToken),
    onSuccess: () => {
      setActiveStep(2);
      passwordFormik.setFieldValue('otpToken', tokenFormik.values.otpToken);
    },
    onError: (error) => {
      console.error('비밀번호 변경 실패:', error);
    },
  });

  // 비밀번호 변경 mutation
  const passwordMutation = useMutation({
    mutationKey: mutationKeys.user.resetPassword(),
    mutationFn: (data: ResetPasswordData) => resetPassword(data),
    onSuccess: () => {
      setActiveStep(3);
    },
    onError: (error) => {
      console.error('비밀번호 변경 실패:', error);
    },
  });

  // 이메일 폼
  const emailFormik = useFormik({
    initialValues: {
      email: '',
      token: '', // verify token
    },
    validationSchema: emailSchema,
    onSubmit: (values) => {
      emailMutation.mutate({ email: values.email, token: values.token });
    },
  });

  // 토큰 검증 폼
  const tokenFormik = useFormik({
    initialValues: {
      token: '', // verify token
      otpToken: '', // otp token
    },
    validationSchema: tokenSchema,
    onSubmit: (values) => {
      verifyTokenMutation.mutate({ token: values.token, otpToken: values.otpToken });
    },
  });

  // 비밀번호 폼
  const passwordFormik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
      token: '',
      otpToken: '',
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      passwordMutation.mutate({
        accessDevice: detectUserDevice(),
        accessBrowser: detectBrowser(),
        accessUserAgent: navigator.userAgent,
        email: emailFormik.values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        token: values.token,
        otpToken: values.otpToken,
      });
    },
  });

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  useEffect(() => {
    getCsrfTokenMutation();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ height: '100%' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        py={4}
        height="100%"
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            {/* 헤더 */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 1,
                }}
              >
                계정 찾기
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                비밀번호를 잊으셨나요?
              </Typography>
            </Box>

            {/* 스텝퍼 */}
            <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    slots={{
                      stepIcon: index < activeStep ? CheckCircleIcon : undefined,
                    }}
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontWeight: 600,
                        fontSize: '1.1rem',
                      },
                    }}
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {step.description}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            {/* 에러 메시지 */}
            {emailMutation.isError && (
              <Fade in={emailMutation.isError}>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  이메일 발송에 실패했습니다. 다시 시도해주세요.
                </Alert>
              </Fade>
            )}

            {passwordMutation.isError && (
              <Fade in={passwordMutation.isError}>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  비밀번호 변경에 실패했습니다. 다시 시도해주세요.
                </Alert>
              </Fade>
            )}

            {verifyTokenMutation.isError && (
              <Fade in={verifyTokenMutation.isError}>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  토큰 검증에 실패했습니다. 다시 시도해주세요.
                </Alert>
              </Fade>
            )}

            {/* 성공 메시지 */}
            {emailMutation.isSuccess && (
              <Fade in={emailMutation.isSuccess}>
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  {emailMutation.data?.message || '비밀번호 재설정 이메일이 발송되었습니다.'}
                </Alert>
              </Fade>
            )}

            {verifyTokenMutation.isSuccess && (
              <Fade in={verifyTokenMutation.isSuccess}>
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  {verifyTokenMutation.data?.message || '토큰이 성공적으로 검증되었습니다.'}
                </Alert>
              </Fade>
            )}

            {passwordMutation.isSuccess && (
              <Fade in={passwordMutation.isSuccess}>
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  {passwordMutation.data?.message || '비밀번호가 성공적으로 변경되었습니다.'}
                </Alert>
              </Fade>
            )}

            {/* 스텝 1: 이메일 입력 */}
            {activeStep === 0 && (
              <Box component="form" onSubmit={emailFormik.handleSubmit}>
                <StyledTextField
                  fullWidth
                  label="이메일 주소"
                  type="email"
                  name="email"
                  value={emailFormik.values.email}
                  onChange={emailFormik.handleChange}
                  onBlur={emailFormik.handleBlur}
                  error={emailFormik.touched.email && Boolean(emailFormik.errors.email)}
                  helperText={emailFormik.touched.email && emailFormik.errors.email}
                  placeholder="example@email.com"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <StyledButton type="submit" variant="contained" disabled={emailMutation.isPending || !emailFormik.values.email} fullWidth>
                    {emailMutation.isPending ? '처리 중...' : '다음'}
                  </StyledButton>
                </Box>
              </Box>
            )}

            {/* 스텝 2: 토큰 검증 */}
            {activeStep === 1 && (
              <Box component="form" onSubmit={tokenFormik.handleSubmit}>
                <StyledTextField
                  fullWidth
                  label="OTP 토큰"
                  name="otpToken"
                  value={tokenFormik.values.otpToken}
                  onChange={tokenFormik.handleChange}
                  onBlur={tokenFormik.handleBlur}
                  error={tokenFormik.touched.otpToken && Boolean(tokenFormik.errors.otpToken)}
                  helperText={tokenFormik.touched.otpToken && tokenFormik.errors.otpToken}
                  placeholder="OTP 토큰을 입력해주세요"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <StyledButton
                    type="submit"
                    variant="contained"
                    disabled={verifyTokenMutation.isPending || !tokenFormik.values.token || !tokenFormik.values.otpToken}
                    fullWidth
                  >
                    {verifyTokenMutation.isPending ? '처리 중...' : '다음'}
                  </StyledButton>
                </Box>
              </Box>
            )}

            {/* 스텝 3: 새 비밀번호 설정 */}
            {activeStep === 2 && (
              <Box component="form" onSubmit={passwordFormik.handleSubmit}>
                <StyledTextField
                  fullWidth
                  label="새 비밀번호"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={passwordFormik.values.password}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  error={passwordFormik.touched.password && Boolean(passwordFormik.errors.password)}
                  helperText={passwordFormik.touched.password && passwordFormik.errors.password}
                  placeholder="8자 이상, 영문과 숫자 포함"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" type="button">
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ mb: 3 }}
                />

                <StyledTextField
                  fullWidth
                  label="비밀번호 확인"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordFormik.values.confirmPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
                  helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword}
                  placeholder="비밀번호를 다시 입력해주세요"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" type="button">
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <StyledButton variant="outlined" onClick={handleBack} startIcon={<ArrowBackIcon />} type="button">
                    이전
                  </StyledButton>
                  <StyledButton
                    type="submit"
                    variant="contained"
                    disabled={passwordMutation.isPending || !passwordFormik.values.password || !passwordFormik.values.confirmPassword}
                    sx={{ flex: 1 }}
                  >
                    {passwordMutation.isPending ? '처리 중...' : '비밀번호 변경'}
                  </StyledButton>
                </Box>
              </Box>
            )}

            {/* 스텝 3: 완료 */}
            {activeStep === 3 && (
              <Box sx={{ textAlign: 'center' }}>
                <CheckCircleIcon
                  sx={{
                    fontSize: 64,
                    color: 'success.main',
                    mb: 2,
                  }}
                />
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  비밀번호 변경 완료!
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  새로운 비밀번호로 로그인할 수 있습니다.
                </Typography>

                <ActionButton variant="contained" fullWidth onClick={() => router.push('/auth/login')}>
                  로그인 페이지로 이동
                </ActionButton>
              </Box>
            )}

            {/* 추가 안내 */}
            {activeStep < 3 && (
              <Stack direction="row" alignItems="center" justifyContent="center" gap={1} sx={{ mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  계정이 기억나셨나요?
                </Typography>
                <Link component={NextLink} href="/auth/login" variant="body2" underline="hover">
                  로그인
                </Link>
              </Stack>
            )}
          </CardContent>
        </StyledCard>
      </Stack>
    </Container>
  );
};

export default ForgotPassword;
