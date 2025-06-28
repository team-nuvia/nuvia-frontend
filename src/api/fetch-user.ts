'use client';

import { snapApi } from '.';

export async function fetchUser() {
  const response = await snapApi.get('/users/me');
  return response.data;
}
