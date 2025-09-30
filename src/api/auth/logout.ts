import { LogoutResponse } from '@/models/LogoutResponse';
import { snapApi } from '..';

export async function logout() {
  const response = await snapApi.post<ServerResponse<LogoutResponse>>('/auth/logout');
  // localStorage.removeItem('access_token');
  return response.data;
}
