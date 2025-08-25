import { snapApi } from '.';

export const toggleReadNotification = async (notificationId: number, isRead: boolean) => {
  const response = await snapApi.patch(`/notifications/${notificationId}/read`, { isRead });
  return response.data;
};
