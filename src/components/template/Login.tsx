'use client';

import ActionButton from '@components/atom/ActionButton';
import CommonText from '@components/atom/CommonText';
import ActionForm from '@components/molecular/ActionForm';
import { Stack, TextField } from '@mui/material';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface LoginProps {}
const Login: React.FC<LoginProps> = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Stack flex={1} gap={10} p={5} alignItems="center" justifyContent="center">
      <ActionForm
        title={
          <Stack
            direction="row"
            gap={2}
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src="/nuvia_logo_only.png"
              alt="logo"
              width={50}
              height={50}
            />
            <CommonText variant="h5" align="center">
              로그인
            </CommonText>
          </Stack>
        }
        slots={
          <>
            <TextField
              name="email"
              autoComplete="email"
              size="small"
              label="Email"
              type="email"
              value={formData.email}
              fullWidth
              placeholder="이메일을 입력해주세요."
              onChange={(e) => {
                handleChange(e);
              }}
              sx={{
                '& .MuiOutlinedInput-input:autofill': {
                  WebkitBoxShadow: (theme) =>
                    `0 0 0 1000px ${theme.palette.background.default} inset`,
                  WebkitTextFillColor: (theme) => theme.palette.text.primary,
                },
              }}
            />
            <TextField
              name="password"
              autoComplete="current-password"
              size="small"
              label="Password"
              type="password"
              value={formData.password}
              fullWidth
              placeholder="비밀번호를 입력해주세요."
              onChange={(e) => {
                handleChange(e);
              }}
              sx={{
                '& .MuiOutlinedInput-input:autofill': {
                  WebkitBoxShadow: (theme) =>
                    `0 0 0 1000px ${theme.palette.background.default} inset`,
                  WebkitTextFillColor: (theme) => theme.palette.text.primary,
                },
              }}
            />
          </>
        }
        submitText="로그인"
        onSubmit={handleSubmit}
      />
    </Stack>
  );
};

export default Login;
