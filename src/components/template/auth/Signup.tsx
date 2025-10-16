'use client';

import { useAuthStore } from '@/store/auth.store';
import mutationKeys from '@/store/lib/mutation-key';
import { signup } from '@api/user/signup';
import { BRAND_NAME } from '@common/variables';
import CommonText from '@components/atom/CommonText';
import ActionForm from '@components/molecular/ActionForm';
import BrandHead from '@components/molecular/BrandHead';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import { Checkbox, Container, Stack, TextField, useTheme } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import { Fragment, useContext, useEffect, useLayoutEffect, useState } from 'react';
import * as Yup from 'yup';
import Terms from '../Terms';
import Privacy from '../Privacy';

interface SignupProps {}

const Signup: React.FC<SignupProps> = () => {
  const theme = useTheme();
  const router = useAuthStore((state) => state.router)!;
  const addNotice = useAuthStore((state) => state.addNotice)!;
  const [termsAgreed, setTermsAgreed] = useState([false, false]);
  const { handleOpenDialog } = useContext(GlobalDialogContext)!;
  const { mutate: signupMutation } = useMutation({
    mutationKey: mutationKeys.user.signup(),
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
    nickname: Yup.string()
      .matches(/^[a-zA-Z0-9]+$/, '닉네임은 영문 대소문자와 숫자만 가능합니다')
      .required('닉네임을 입력해주세요.')
      .min(2, '닉네임은 2자 이상이어야 합니다.')
      .max(20, '닉네임은 20자 이하여야 합니다.'),
    email: Yup.string().required('이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),
    password: Yup.string()
      .required('비밀번호를 입력해주세요.')
      .min(8, '비밀번호는 8자 이상이어야 합니다.')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '비밀번호는 영문 대소문자와 숫자를 포함해야 합니다.'),
    passwordConfirm: Yup.string()
      .required('비밀번호 확인을 입력해주세요.')
      .oneOf([Yup.ref('password')], '비밀번호가 일치하지 않습니다.'),
    termsAgreed: Yup.boolean().isTrue('이용약관 및 개인정보 처리방침을 확인해주세요.').required('이용약관 및 개인정보 처리방침을 확인해주세요.'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      nickname: '',
      email: '',
      password: '',
      passwordConfirm: '',
      termsAgreed: false,
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
  }, [formik.touched.password, formik.touched.passwordConfirm, formik.values.password, formik.values.passwordConfirm]);

  // 필드 라벨과 타입 매핑
  const fieldConfig = [
    { name: 'name', label: '이름', type: 'text' },
    { name: 'nickname', label: '닉네임', type: 'text' },
    { name: 'email', label: '이메일', type: 'email' },
    { name: 'password', label: '비밀번호', type: 'password' },
    { name: 'passwordConfirm', label: '비밀번호 확인', type: 'password' },
  ];

  useEffect(() => {
    if (termsAgreed[0] && termsAgreed[1]) {
      formik.setFieldValue('termsAgreed', true);
    }
  }, [termsAgreed]);

  useEffect(() => {
    if (!formik.values.termsAgreed) {
      setTermsAgreed([false, false]);
    } else {
      setTermsAgreed([true, true]);
    }
  }, [formik.values.termsAgreed]);

  function handleOpenTerms() {
    handleOpenDialog({
      title: '이용약관 확인',
      content: <Terms />,
      type: 'info',
      confirmText: '확인',
      cancelText: '닫기',
      actionCallback: () => {
        setTermsAgreed((prev) => {
          const newTermsAgreed = [...prev];
          newTermsAgreed[0] = true;
          return newTermsAgreed;
        });
      },
    });
  }

  function handleOpenPrivacy() {
    handleOpenDialog({
      title: '개인정보 처리방침 확인',
      content: <Privacy />,
      type: 'info',
      confirmText: '확인',
      cancelText: '닫기',
      actionCallback: () => {
        setTermsAgreed((prev) => {
          const newTermsAgreed = [...prev];
          newTermsAgreed[1] = true;
          return newTermsAgreed;
        });
      },
    });
  }

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
          slots={fieldConfig
            .map(({ name, label, type }) => (
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
            ))
            .concat([
              <Fragment key="termsAgreed">
                <Stack direction="row" alignItems="center" gap={1}>
                  <Checkbox
                    name="termsAgreed"
                    disabled={!termsAgreed[0] || !termsAgreed[1]}
                    checked={formik.values.termsAgreed}
                    onChange={(e) => formik.handleChange(e)}
                    onBlur={formik.handleBlur}
                    color="primary"
                    required
                    sx={{
                      p: 0,
                    }}
                  />
                  <CommonText variant="body2" color="textSecondary">
                    <span>
                      <span style={{ color: !termsAgreed[0] ? '#999' : '#1976d2', fontWeight: 500, cursor: 'pointer' }} onClick={handleOpenTerms}>
                        이용약관
                      </span>
                      과{' '}
                      <span style={{ color: !termsAgreed[1] ? '#999' : '#1976d2', fontWeight: 500, cursor: 'pointer' }} onClick={handleOpenPrivacy}>
                        개인정보 처리방침
                      </span>
                      에 동의합니다.
                    </span>
                  </CommonText>
                </Stack>
                {formik.touched.termsAgreed && Boolean(formik.errors.termsAgreed) && (
                  <CommonText variant="caption" color="error">
                    {formik.errors.termsAgreed}
                  </CommonText>
                )}
              </Fragment>,
            ])}
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
