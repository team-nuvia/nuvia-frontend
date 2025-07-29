import { GetAccessTokenResponse } from '@/models/GetAccessTokenResponse';
import { snapApi } from '.';

export const login = async (
  email: string,
  password: string,
): Promise<ServerResponse<GetAccessTokenResponse>> => {
  const response = await snapApi.post<ServerResponse<GetAccessTokenResponse>>(
    '/auth/login',
    { email, password },
  );
  const accessToken = response.data.payload?.accessToken;
  if (accessToken) {
    localStorage.setItem('access_token', accessToken);
  }
  return response.data;
};
