'use client';

import { login } from '@api/login';
import { BRAND_NAME } from '@common/variables';
import CommonText from '@components/atom/CommonText';
import ActionForm from '@components/molecular/ActionForm';
import { AuthenticationContext } from '@context/AuthenticationContext';
import LoadingContext from '@context/LodingContext';
import { Box, Container, Grid, Link, Stack, TextField } from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';

interface LoginProps {}
const Login: React.FC<LoginProps> = () => {
  const { setLoading } = useContext(LoadingContext);
  const { fetchUser } = useContext(AuthenticationContext);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await login(formData.email, formData.password);
    if (response.ok) {
      fetchUser();
      router.push('/');
    } else {
      setError(response.message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
            <Stack
              gap={2}
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <Image
                  src="/nuvia_logo_only.png"
                  alt="logo"
                  width={60}
                  height={60}
                />
                <CommonText variant="h4" component="h1" thickness="bold">
                  {BRAND_NAME}
                </CommonText>
              </Stack>
              <CommonText variant="body2" color="textSecondary">
                로그인을 위해 아래 정보를 입력해주세요.
              </CommonText>
            </Stack>
          }
          slots={Object.entries(formData).map(([key, value]) => (
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
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-input:autofill': {
                  WebkitBoxShadow: (theme) =>
                    `0 0 0 1000px ${theme.palette.background.paper} inset`,
                  WebkitTextFillColor: (theme) => theme.palette.text.primary,
                },
              }}
            />
          ))}
          submitText="로그인"
          onSubmit={handleSubmit}
          signupPath="/signup"
          signupText="계정이 없으신가요?"
        />
        <Grid container sx={{ mt: 2 }}>
          <Grid size={{ xs: 12 }}>
            <Link
              component={NextLink}
              href="/forgot-password"
              variant="body2"
              underline="hover"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
