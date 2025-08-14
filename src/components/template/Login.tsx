'use client';

import { login } from '@api/login';
import { BRAND_NAME } from '@common/variables';
import CommonText from '@components/atom/CommonText';
import ActionForm from '@components/molecular/ActionForm';
import { AuthenticationContext } from '@context/AuthenticationContext';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import LoadingContext from '@context/LodingContext';
import { Box, Container, Grid, Link, Stack, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { isNil } from '@util/isNil';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useLayoutEffect } from 'react';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  email: yup.string().email('이메일 형식이 올바르지 않습니다.').required('이메일을 입력해주세요.'),
  password: yup.string().min(8, '비밀번호는 8자 이상이어야 합니다.').max(13, '비밀번호는 13자 이하여야 합니다.').required('비밀번호를 입력해주세요.'),
});

interface LoginProps {}
const Login: React.FC<LoginProps> = () => {
  const { startLoading, endLoading } = useContext(LoadingContext);
  const { fetchUser, user } = useContext(AuthenticationContext);
  const { addNotice } = useContext(GlobalSnackbarContext);
  const router = useRouter();
  const formik = useFormik<{ email: string; password: string }>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const { mutate: loginMutation } = useMutation({
    mutationFn: (values: { email: string; password: string }) => login(values.email, values.password),
    mutationKey: ['login'],
    onSuccess: (response) => {
      addNotice(response.message, 'success');
      fetchUser();
      router.push('/');
    },
    onError: (error) => {
      const axiosError = error as AxiosError;
      const response = axiosError.response;
      const errorData = response?.data as ServerResponse<any>;
      if (errorData.httpStatus !== 500) {
        addNotice(errorData.message, 'error');
      } else {
        addNotice('로그인에 실패했습니다. 관리자에게 문의해주세요.', 'error');
      }
    },
  });

  useLayoutEffect(() => {
    startLoading('페이지 로드 중...');
  }, []);

  useEffect(() => {
    if (!isNil(user)) {
      addNotice('이미 로그인한 상태입니다.', 'warning');
      router.push('/');
    } else {
      endLoading();
    }
  }, []);

  async function handleSubmit(values: { email: string; password: string }) {
    loginMutation(values);
    // try {
    //   const response = await login(values.email, values.password);
    //   console.log('🚀 ~ handleSubmit ~ response:', response);
    //   if (response.ok) {
    //     await fetchUser();
    //     addNotice(response.message, 'success');
    //     router.push('/');
    //   } else {
    //     addNotice(response.message, 'error');
    //   }
    // } catch (error: unknown) {
    //   console.log('🚀 ~ handleSubmit ~ error:', error);
    //   addNotice(error instanceof AxiosError ? error.response?.data.message : '알 수 없는 오류가 발생했습니다.', 'error');
    // }
  }

  return (
    <Box
      sx={{
        mt: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container component="main" maxWidth="xs">
        <ActionForm
          title={
            <Stack gap={2} alignItems="center" justifyContent="center" textAlign="center">
              <Stack direction="row" alignItems="center" gap={1}>
                <Image src="/nuvia_logo_only.png" alt="logo" width={60} height={60} />
                <CommonText variant="h4" component="h1" thickness="bold">
                  {BRAND_NAME}
                </CommonText>
              </Stack>
              <CommonText variant="body2" color="textSecondary">
                로그인을 위해 아래 정보를 입력해주세요.
              </CommonText>
            </Stack>
          }
          slots={Object.entries(formik.values).map(([key, value]) => (
            <TextField
              key={key}
              name={key}
              autoComplete={key}
              size="medium"
              required
              fullWidth
              label={key}
              type={key === 'password' ? 'password' : 'text'}
              value={value}
              placeholder={`${key}을 입력해주세요.`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched[key as keyof typeof formik.values] && Boolean(formik.errors[key as keyof typeof formik.values])}
              helperText={formik.touched[key as keyof typeof formik.values] && formik.errors[key as keyof typeof formik.values]}
              sx={{
                '& .MuiOutlinedInput-input:autofill': {
                  WebkitBoxShadow: (theme) => `0 0 0 1000px ${theme.palette.background.paper} inset`,
                  WebkitTextFillColor: (theme) => theme.palette.text.primary,
                },
              }}
            />
          ))}
          submitText="로그인"
          onSubmit={formik.handleSubmit}
          signupPath="/auth/signup"
          signupText="계정이 없으신가요?"
        />
        <Grid container sx={{ mt: 2 }}>
          <Grid size={{ xs: 12 }}>
            <Link component={NextLink} href="/forgot-password" variant="body2" underline="hover">
              비밀번호를 잊으셨나요?
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
