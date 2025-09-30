import { snapApi } from '..';

export const suspendAccount = async (): Promise<ServerResponse<void>> => {
  const response = await snapApi.patch('/users/me/suspend');
  return response.data;
};
