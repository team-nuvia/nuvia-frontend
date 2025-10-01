import { snapApi } from '..';

interface GetCsrfTokenData {
  token: string;
}

export const getCsrfToken = async (): Promise<ServerResponse<GetCsrfTokenData>> => {
  const response = await snapApi.post('/auth/csrftoken');
  return response.data;
};
