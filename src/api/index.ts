import { API_URL } from '@common/variables';
import axios from 'axios';

axios.defaults.withCredentials = true;

export const snapApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1 * 60 * 1000,
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

const MAX_RETRY_COUNT = 10;
let maxRetryCount = 0;

snapApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
      return Promise.reject(error);
    }

    if (error.response) {
      if (error.response.status === 401) {
        console.log('🔥 401이잖아?', error.response.data);
        if (!error.response.data) {
          await snapApi.post('/auth/logout');
          localStorage.removeItem('access_token');
          maxRetryCount = 0;
          return Promise.reject(error);
        }

        if (error.response.data.name === 'UnauthorizedException') {
          await snapApi.post('/auth/logout');
          localStorage.removeItem('access_token');
          maxRetryCount = 0;
          return Promise.reject(error);
        }

        if (error.response.data.name === 'ExpiredTokenExceptionDto') {
          if (maxRetryCount < MAX_RETRY_COUNT) {
            try {
              maxRetryCount++;

              const res = await snapApi.post('/auth/refresh');
              const accessToken = res.data.payload.accessToken;

              if (accessToken) {
                localStorage.setItem('access_token', accessToken);
              }
            } catch (error: any) {
              console.log('🔥 refresh 실패?', error.response.data);
              if (error.response.data.name === 'ExpiredTokenExceptionDto' || error.response.data.name === 'RefreshTokenRequiredExceptionDto') {
                await snapApi.post('/auth/logout');
                localStorage.removeItem('access_token');
                maxRetryCount = 0;
                return Promise.reject(error);
              }
              maxRetryCount = 0;
              return Promise.reject(error);
            }

            try {
              error.config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
              const result = await snapApi(error.config);
              maxRetryCount = 0;
              return Promise.resolve(result);
            } catch {
              maxRetryCount = 0;
              return Promise.reject(error);
            }
          } else {
            await snapApi.post('/auth/logout');
            localStorage.removeItem('access_token');
            maxRetryCount = 0;
            return Promise.reject(error);
          }
        }
      }
    }

    return Promise.reject(error);
  },
);
