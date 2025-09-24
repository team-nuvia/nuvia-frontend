import { snapApi } from '.';

export const updateUserSettings = async (mailNotification: boolean): Promise<ServerResponse<void>> => {
  const response = await snapApi.patch<ServerResponse<void>>('/users/me/settings', {
    mailNotification,
  });
  return response.data;
};
