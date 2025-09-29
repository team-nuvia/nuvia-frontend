'use client';

import mutationKeys from '@/store/lib/mutation-key';
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
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';

// API 함수들 (가명으로 작성)
const sendPasswordResetEmail = async (email: string) => {
  // 실제 API 호출 로직
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { success: true, message: '비밀번호 재설정 이메일이 발송되었습니다.' };
};

const resetPassword = async (data: { email: string; newPassword: string }) => {
  // 실제 API 호출 로직
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { success: true, message: '비밀번호가 성공적으로 변경되었습니다.' };
};

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 480,
  width: '100%',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  padding: '12px 32px',
  boxShadow: '0 4px 16px rgba(25, 118, 210, 0.2)',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
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

const passwordSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, '영문과 숫자를 포함해야 합니다.')
    .required('새 비밀번호를 입력해주세요.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호 확인을 입력해주세요.'),
});

interface ForgotPasswordProps {}
const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const steps = [
    {
      label: '이메일 확인',
      description: '가입하신 이메일 주소를 입력해주세요.',
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

  // 이메일 전송 mutation
  const emailMutation = useMutation({
    mutationKey: mutationKeys.user.forgotPassword(),
    mutationFn: sendPasswordResetEmail,
    onSuccess: () => {
      setActiveStep(1);
    },
    onError: (error) => {
      console.error('이메일 전송 실패:', error);
    },
  });

  // 비밀번호 변경 mutation
  const passwordMutation = useMutation({
    mutationKey: mutationKeys.user.resetPassword(),
    mutationFn: resetPassword,
    onSuccess: () => {
      setActiveStep(2);
    },
    onError: (error) => {
      console.error('비밀번호 변경 실패:', error);
    },
  });

  // 이메일 폼
  const emailFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: emailSchema,
    onSubmit: (values) => {
      emailMutation.mutate(values.email);
    },
  });

  // 비밀번호 폼
  const passwordFormik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      passwordMutation.mutate({
        email: emailFormik.values.email,
        newPassword: values.newPassword,
      });
    },
  });

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

            {/* 성공 메시지 */}
            {emailMutation.isSuccess && (
              <Fade in={emailMutation.isSuccess}>
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  {emailMutation.data?.message || '비밀번호 재설정 이메일이 발송되었습니다.'}
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

            {/* 스텝 2: 새 비밀번호 설정 */}
            {activeStep === 1 && (
              <Box component="form" onSubmit={passwordFormik.handleSubmit}>
                <StyledTextField
                  fullWidth
                  label="새 비밀번호"
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordFormik.values.newPassword}
                  onChange={passwordFormik.handleChange}
                  onBlur={passwordFormik.handleBlur}
                  error={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}
                  helperText={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword}
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
                    disabled={passwordMutation.isPending || !passwordFormik.values.newPassword || !passwordFormik.values.confirmPassword}
                    sx={{ flex: 1 }}
                  >
                    {passwordMutation.isPending ? '처리 중...' : '비밀번호 변경'}
                  </StyledButton>
                </Box>
              </Box>
            )}

            {/* 스텝 3: 완료 */}
            {activeStep === 2 && (
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

                <StyledButton variant="contained" href="/auth/login" fullWidth>
                  로그인 페이지로 이동
                </StyledButton>
              </Box>
            )}

            {/* 추가 안내 */}
            {activeStep < 2 && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  계정이 기억나셨나요?{' '}
                  <Button
                    href="/auth/login"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      p: 0,
                      minWidth: 'auto',
                    }}
                  >
                    로그인하기
                  </Button>
                </Typography>
              </Box>
            )}
          </CardContent>
        </StyledCard>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
