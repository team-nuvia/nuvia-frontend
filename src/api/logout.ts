import { LogoutResponse } from '@/models/LogoutResponse';
import { snapApi } from '.';

export async function logout() {
  localStorage.removeItem('access_token');
  const response = await snapApi.post<ServerResponse<LogoutResponse>>('/auth/logout');
  return response.data;
}
