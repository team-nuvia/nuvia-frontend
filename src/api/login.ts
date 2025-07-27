import { GetMeResponse } from '@/models/GetMeResponse';
import { snapApi } from '.';

export const login = async (
  email: string,
  password: string,
): Promise<ServerResponse<GetMeResponse>> => {
  const response = await snapApi.post<ServerResponse<GetMeResponse>>(
    '/auth/login',
    {
      email,
      password,
    },
  );
  return response.data;
};
