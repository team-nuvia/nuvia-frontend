import { snapApi } from "@/api";

export const sendPasswordResetEmail = async (email: string) => {
  const response = await snapApi.post('/auth/send-password-reset-email', { email });
  return response.data;
};