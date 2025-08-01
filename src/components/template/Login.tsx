'use client';

import { login } from '@api/login';
import { BRAND_NAME } from '@common/variables';
import CommonText from '@components/atom/CommonText';
import ActionForm from '@components/molecular/ActionForm';
import { AuthenticationContext } from '@context/AuthenticationContext';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import LoadingContext from '@context/LodingContext';
import { Box, Container, Grid, Link, Stack, TextField } from '@mui/material';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  email: yup.string().email('이메일 형식이 올바르지 않습니다.').required('이메일을 입력해주세요.'),
  password: yup.string().min(8, '비밀번호는 8자 이상이어야 합니다.').max(13, '비밀번호는 13자 이하여야 합니다.').required('비밀번호를 입력해주세요.'),
});

interface LoginProps {}
const Login: React.FC<LoginProps> = () => {
  const { setLoading } = useContext(LoadingContext);
  const { fetchUser } = useContext(AuthenticationContext);
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

  useEffect(() => {
    setLoading(false);
  }, []);

  async function handleSubmit(values: { email: string; password: string }) {
    const errors = await formik.validateForm(values);
    if (Object.keys(errors).length > 0) {
      formik.setErrors(errors);
      return;
    }

    try {
      const response = await login(values.email, values.password);
      if (response.ok) {
        fetchUser()
          .then(() => {
            router.push('/');
          })
          .finally(() => {
            addNotice(response.message, 'success');
          });
      } else {
        addNotice(response.message, 'error');
      }
    } catch (error: unknown) {
      addNotice(error instanceof AxiosError ? error.response?.data.message : '알 수 없는 오류가 발생했습니다.', 'error');
    }
  }

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: (theme) => theme.palette.grey[100],
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
          signupPath="/signup"
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
