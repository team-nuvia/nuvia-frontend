'use client';

import { snapApi } from '.';

export async function fetchUser() {
  const response = await snapApi.get({ url: '/users/me' });
  return response.data;
}
