import { snapApi } from '.';

export const signup = async (values: { name: string; email: string; password: string }) => {
  const response = await snapApi.post('/users', values);
  return response.data;
};
