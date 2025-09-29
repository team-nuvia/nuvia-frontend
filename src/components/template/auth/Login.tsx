'use client';

import { useAuthStore } from '@/store/auth.store';
import { login } from '@api/login';
import { BRAND_NAME } from '@common/variables';
import CommonText from '@components/atom/CommonText';
import ActionForm from '@components/molecular/ActionForm';
import BrandHead from '@components/molecular/BrandHead';
import { Container, Grid, Link, Stack, TextField, useTheme } from '@mui/material';
import { SocialProvider } from '@share/enums/social-provider.enum';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import NextLink from 'next/link';
import { useEffect } from 'react';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  email: yup.string().email('이메일 형식이 올바르지 않습니다.').required('이메일을 입력해주세요.'),
  password: yup.string().min(8, '비밀번호는 8자 이상이어야 합니다.').max(13, '비밀번호는 13자 이하여야 합니다.').required('비밀번호를 입력해주세요.'),
});

interface SearchParams {
  action?: string;
  token?: string;
  redirect?: string;
}

interface LoginProps {
  searchParams: SearchParams;
}
const Login: React.FC<LoginProps> = ({ searchParams }) => {
  const { action, token, redirect } = searchParams;
  const theme = useTheme();
  const router = useAuthStore((state) => state.router)!;
  const addNotice = useAuthStore((state) => state.addNotice)!;
  const getUser = useAuthStore((state) => state.actions.getUser);
  const fetchUser = useAuthStore((state) => state.actions.fetchUser);
  const mainUrl = useAuthStore((state) => state.mainUrl);
  const { mutate: loginMutation } = useMutation({
    mutationFn: (values: { email: string; password: string }) => login(values.email, values.password),
    mutationKey: ['login'],
    onSuccess: async (response) => {
      formik.setSubmitting(false);

      await fetchUser();
      const user = getUser();
      if (user) {
        if (action === 'invitation' && redirect && token) {
          router.push(`${redirect}?q=${token}`);
        } else if (action === 'view' && redirect) {
          router.push(redirect);
        } else {
          router.push(mainUrl);
        }
      } else {
        router.push('/auth/login');
      }

      localStorage.removeItem('nq');

      addNotice(response.message, 'success');
    },
    onError: (error) => {
      formik.setSubmitting(false);
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

  const formik = useFormik<{ email: string; password: string }>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      formik.setSubmitting(true);
      loginMutation(values);
    },
  });

  useEffect(() => {
    const nq = localStorage.getItem('nq');
    const url = new URLSearchParams(window.location.search.slice(1));
    const reason = url.get('reason');
    if (nq) {
      window.location.search = nq;
      localStorage.removeItem('nq');
    }
    if (reason) {
      addNotice(reason, 'warning');
    }
  }, []);

  useEffect(() => {
    router?.prefetch(mainUrl);
  }, [router]);

  return (
    <Stack flex={1} py={5} direction="row" alignItems="center" justifyContent="center">
      <Container component="main" maxWidth="xs">
        <ActionForm
          isLoading={formik.isSubmitting}
          title={
            <Stack gap={2} alignItems="center" justifyContent="center" textAlign="center">
              <Stack direction="row" alignItems="center" gap={1}>
                <BrandHead
                  title={BRAND_NAME}
                  width={50}
                  height={50}
                  primaryColor={theme.palette.primary.main}
                  secondaryColor={theme.palette.secondary.main}
                  noRoute
                />
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
                  WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
                  WebkitTextFillColor: theme.palette.text.primary,
                },
              }}
            />
          ))}
          submitText="로그인"
          socialLogin={[SocialProvider.Google]}
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit(e);
          }}
          signupPath="/auth/signup"
          signupText="계정이 없으신가요?"
        />
        <Grid container sx={{ mt: 2 }}>
          <Grid size={{ xs: 12 }}>
            <Link component={NextLink} href="/auth/forgot-password" variant="body2" underline="hover">
              비밀번호를 잊으셨나요?
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
};

export default Login;
