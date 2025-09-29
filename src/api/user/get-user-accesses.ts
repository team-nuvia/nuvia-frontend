import { GetPaginatedResponse } from '@/models/GetPaginatedResponse';
import { snapApi } from '..';

export interface UserSimpleInfo {
  id: number;
  name: string;
  email: string;
  nickname: string;
}

export interface UserAccess {
  id: number;
  accessIp: string;
  accessDevice: string | null;
  accessBrowser: string | null;
  accessUserAgent: string | null;
  status: string;
  lastAccessAt: Date | null;
  user: UserSimpleInfo;
}

export const getUserAccesses = async ({
  page,
  limit,
  search,
}: Partial<{
  page: number;
  limit: number;
  search: string;
}>): Promise<ServerResponse<GetPaginatedResponse<UserAccess>>> => {
  const queryString = new URLSearchParams({
    page: page?.toString() ?? '',
    limit: limit?.toString() ?? '',
    search: search ?? '',
  });
  const response = await snapApi.get(`/users/user-accesses?${queryString.toString()}`);
  return response.data;
};
