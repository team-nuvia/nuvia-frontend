'use client';

import { API_URL } from '@common/variables';
import axios from 'axios';

axios.defaults.withCredentials = true;

export const snapApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

snapApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let maxRetryCount = 0;

snapApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log('🚀 ~ error:', error);
    if (error.response.data.httpStatus === 401) {
      if (error.response.data.message === '인증되지 않은 요청입니다.') {
        await snapApi.post('/auth/logout');
        localStorage.removeItem('access_token');
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }

      if (maxRetryCount < 3) {
        try {
          maxRetryCount++;
          await new Promise((resolve) => setTimeout(resolve, 5000));

          const res = await snapApi.post('/auth/refresh');
          const accessToken = res.data.accessToken;

          localStorage.setItem('access_token', accessToken);

          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return snapApi(error.config).then((res) => {
            maxRetryCount = 0;
            return res;
          });
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  },
);
