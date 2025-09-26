import { snapApi } from '.';

export const updateUserSettings = async (mailing: boolean): Promise<ServerResponse<void>> => {
  const response = await snapApi.patch<ServerResponse<void>>('/users/me/settings', {
    mailing,
  });
  return response.data;
};
