import { snapApi } from '..';

export const deleteAccount = async (): Promise<ServerResponse<void>> => {
  const response = await snapApi.delete('/users/me');
  return response.data;
};
