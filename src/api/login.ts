import { GetAccessTokenResponse } from '@/models/GetAccessTokenResponse';
import { detectBrowser } from '@/util/detectBrowser';
import { detectUserDevice } from '@/util/detectUserDevice';
import { snapApi } from '.';

export const login = async (email: string, password: string): Promise<ServerResponse<GetAccessTokenResponse>> => {
  const accessDevice = detectUserDevice();
  const accessBrowser = detectBrowser();
  const accessUserAgent = navigator.userAgent;

  const response = await snapApi.post<ServerResponse<GetAccessTokenResponse>>('/auth/login', {
    email,
    password,
    accessDevice,
    accessBrowser,
    accessUserAgent,
  });
  const accessToken = response.data.payload?.accessToken;
  if (accessToken) {
    localStorage.setItem('access_token', accessToken);
  }
  return response.data;
};
