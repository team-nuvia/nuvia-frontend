import { snapApi } from "..";

export async function getVerifySession() {
  const response = await snapApi.post('/auth/session');
  return response.data;
}