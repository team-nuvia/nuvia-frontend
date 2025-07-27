'use client';

import { GetMeResponse } from '@/models/GetMeResponse';
import { snapApi } from '.';

export async function getUsersMe(): Promise<ServerResponse<GetMeResponse>> {
  const response = await snapApi.get<ServerResponse<GetMeResponse>>(
    '/users/me',
  );
  return response.data;
}
