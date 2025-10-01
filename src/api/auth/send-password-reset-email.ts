import { snapApi } from '@/api';

interface SendPasswordResetTokenData {
  token: string;
}

export const sendPasswordResetEmail = async (email: string, csrfToken: string): Promise<ServerResponse<SendPasswordResetTokenData>> => {
  const response = await snapApi.post('/auth/reset-password/send', { email, token: csrfToken });
  return response.data;
};
