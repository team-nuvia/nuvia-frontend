import { LogoutResponse } from '@/models/LogoutResponse';
import { snapApi } from '..';

export async function logout() {
  const response = await snapApi.post<ServerResponse<LogoutResponse>>('/auth/logout');
  return response.data;
}
