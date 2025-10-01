import { snapApi } from '..';

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
  token: string;
  otpToken: string;
  accessDevice: string | null;
  accessBrowser: string | null;
  accessUserAgent: string | null;
  email: string;
}

export const resetPassword = async (data: ResetPasswordData) => {
  const { password, confirmPassword } = data;

  if (password !== confirmPassword) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  const response = await snapApi.post('/auth/reset-password', data);
  return response.data;
};
