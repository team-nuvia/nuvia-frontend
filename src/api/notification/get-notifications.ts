import { GetPaginatedResponse } from '@/models/GetPaginatedResponse';
import { NotificationPayload } from '@/models/NotificationPayload';
import { snapApi } from '..';

export const getNotifications = async ({
  page,
  limit,
  search,
}: Partial<{
  page: number;
  limit: number;
  search: string;
}>): Promise<ServerResponse<GetPaginatedResponse<NotificationPayload>>> => {
  const queryString = new URLSearchParams({
    page: page?.toString() ?? '',
    limit: limit?.toString() ?? '',
    search: search ?? '',
  });
  const response = await snapApi.get(`/notifications/me?${queryString.toString()}`);
  return response.data;
};
