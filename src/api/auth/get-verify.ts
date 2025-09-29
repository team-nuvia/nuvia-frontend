import { VerifyTokenResponseDto } from '@/models/VerifyTokenResponseDto';
import { snapApi } from '..';

export async function getVerify(): Promise<ServerResponse<VerifyTokenResponseDto>> {
  const response = await snapApi.post<ServerResponse<VerifyTokenResponseDto>>('/auth/verify');
  return response.data;
};
