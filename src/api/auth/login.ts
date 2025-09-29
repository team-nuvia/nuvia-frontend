import { detectBrowser } from '@/util/detectBrowser';
import { detectUserDevice } from '@/util/detectUserDevice';
import { snapApi } from '..';

export const login = async (email: string, password: string): Promise<ServerResponse<null>> => {
  const accessDevice = detectUserDevice();
  const accessBrowser = detectBrowser();
  const accessUserAgent = navigator.userAgent;

  const response = await snapApi.post<ServerResponse<null>>('/auth/login', {
    email,
    password,
    accessDevice,
    accessBrowser,
    accessUserAgent,
  });

  return response.data;
};
