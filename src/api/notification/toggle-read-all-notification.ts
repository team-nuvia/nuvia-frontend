import { snapApi } from '..';

export const toggleReadAllNotification = async (notificationIds: number[], isRead: boolean) => {
  const response = await snapApi.patch(`/notifications/read-all`, { isRead, notificationIds });
  return response.data;
};
