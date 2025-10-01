import { snapApi } from '..';

export const verifyResetPasswordToken = async (token: string, otpToken: string): Promise<ServerResponse<void>> => {
  const response = await snapApi.post('/auth/reset-password/verify', { token, otpToken });
  return response.data;
};