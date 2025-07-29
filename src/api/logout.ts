import { snapApi } from '.';

export async function logout() {
  await snapApi.post('/auth/logout');
  localStorage.removeItem('access_token');
}
