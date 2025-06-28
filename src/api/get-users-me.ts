'use client';

import { snapApi } from '.';

export const getUsersMe = async () => {
  const response = await snapApi.get('/users/me');
  return response.data;
};
