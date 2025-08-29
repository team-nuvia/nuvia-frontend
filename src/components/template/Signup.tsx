'use client';

import { signup } from '@api/signup';
import { BRAND_NAME } from '@common/variables';
import CommonText from '@components/atom/CommonText';
import ActionForm from '@components/molecular/ActionForm';
import BrandHead from '@components/molecular/BrandHead';
import { AuthenticationContext } from '@context/AuthenticationContext';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import LoadingContext from '@context/LodingContext';
import { Container, Stack, TextField, useTheme } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useLayoutEffect } from 'react';
import * as Yup from 'yup';

interface SignupProps {}

const Signup: React.FC<SignupProps> = () => {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useContext(AuthenticationContext);
  const { endLoading } = useContext(LoadingContext);
  const { addNotice } = useContext(GlobalSnackbarContext);
  const { mutate: signupMutation } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      formik.setSubmitting(false);
      addNotice('회원가입에 성공했습니다.', 'success');
      router.push('/auth/login');
    },
    onError: (error) => {
      formik.setSubmitting(false);
      const axiosError = error as AxiosError;
      const response = axiosError.response;
      const errorData = response?.data as ServerResponse<any>;
      if (errorData.httpStatus !== 500) {
        if (errorData.reason) {
          if (errorData.reason === 'nickname') {
            formik.setFieldError('nickname', '닉네임을 확인해주세요.');
          } else if (errorData.reason === 'email') {
            formik.setFieldError('email', '이메일을 확인해주세요.');
          }
        }
        addNotice(errorData.message, 'error');
      } else {
        addNotice('회원가입에 실패했습니다. 관리자에게 문의해주세요.', 'error');
      }
    },
  });

  // 유효성 검사 스키마
  const validationSchema = Yup.object({
    name: Yup.string().required('이름을 입력해주세요.').min(2, '이름은 2자 이상이어야 합니다.').max(20, '이름은 20자 이하여야 합니다.'),
    nickname: Yup.string().required('닉네임을 입력해주세요.').min(2, '닉네임은 2자 이상이어야 합니다.').max(20, '닉네임은 20자 이하여야 합니다.'),
    email: Yup.string().required('이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),
    password: Yup.string()
      .required('비밀번호를 입력해주세요.')
      .min(8, '비밀번호는 8자 이상이어야 합니다.')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '비밀번호는 영문 대소문자와 숫자를 포함해야 합니다.'),
    passwordConfirm: Yup.string()
      .required('비밀번호 확인을 입력해주세요.')
      .oneOf([Yup.ref('password')], '비밀번호가 일치하지 않습니다.'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      nickname: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      // 여기에 회원가입 API 호출 로직을 추가할 수 있습니다.
      if (values.password !== values.passwordConfirm) {
        formik.setFieldError('passwordConfirm', '비밀번호가 일치하지 않습니다.');
        addNotice('비밀번호가 일치하지 않습니다.', 'warning');
        return;
      }
      const { passwordConfirm, ...data } = values;
      formik.setSubmitting(true);
      signupMutation(data);
    },
  });

  useLayoutEffect(() => {
    if (formik.touched.password && formik.touched.passwordConfirm && formik.values.password !== formik.values.passwordConfirm) {
      formik.setFieldError('passwordConfirm', '비밀번호가 일치하지 않습니다.');
    }
    endLoading();
  }, [formik.touched.password, formik.touched.passwordConfirm, formik.values.password, formik.values.passwordConfirm, endLoading]);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user]);

  // 필드 라벨과 타입 매핑
  const fieldConfig = [
    { name: 'name', label: '이름', type: 'text' },
    { name: 'nickname', label: '닉네임', type: 'text' },
    { name: 'email', label: '이메일', type: 'email' },
    { name: 'password', label: '비밀번호', type: 'password' },
    { name: 'passwordConfirm', label: '비밀번호 확인', type: 'password' },
  ];

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
                회원가입을 위해 아래 정보를 입력해주세요.
              </CommonText>
            </Stack>
          }
          slots={fieldConfig.map(({ name, label, type }) => (
            <TextField
              key={name}
              name={name}
              autoComplete={name}
              size="medium"
              required
              fullWidth
              label={label}
              type={type}
              value={formik.values[name as keyof typeof formik.values]}
              placeholder={`${label}을 입력해주세요.`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched[name as keyof typeof formik.touched] && Boolean(formik.errors[name as keyof typeof formik.errors])}
              helperText={formik.touched[name as keyof typeof formik.touched] && formik.errors[name as keyof typeof formik.errors]}
              sx={{
                '& .MuiOutlinedInput-input:autofill': {
                  WebkitBoxShadow: (theme) => `0 0 0 1000px ${theme.palette.background.paper} inset`,
                  WebkitTextFillColor: (theme) => theme.palette.text.primary,
                },
              }}
            />
          ))}
          submitText="회원가입"
          onSubmit={formik.handleSubmit}
          signupPath="/auth/login"
          signupText="이미 계정이 있으신가요?"
        />
      </Container>
    </Stack>
  );
};

export default Signup;
