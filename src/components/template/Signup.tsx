import ActionForm from '@components/molecular/ActionForm';
import { Stack, TextField } from '@mui/material';
import { useState } from 'react';

const Signup = () => {
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
        title="회원가입"
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
        submitText="회원가입"
        onSubmit={handleSubmit}
      />
    </Stack>
  );
};

export default Signup;
