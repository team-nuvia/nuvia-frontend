'use client';

import { requestMap } from '@/store/request.store';
import { snapApi } from '@api/index';
import { useBlackRouter } from '@hooks/useBlackRouter';
import { getRequestKey } from '@util/getRequestKey';
import { AxiosInstance } from 'axios';
import { createContext, useEffect, useRef, useState } from 'react';

export const AxiosContext = createContext<AxiosInstance | null>(null);
const MAX_RETRY_COUNT = 10;

export const AxiosProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useBlackRouter();
  const maxRetryCount = useRef(0);
  const originalMethod = useRef<{ [key: string]: (...args: any[]) => any }>({
    get: snapApi.get,
    post: snapApi.post,
    put: snapApi.put,
    delete: snapApi.delete,
    patch: snapApi.patch,
    options: snapApi.options,
    head: snapApi.head,
  });

  useEffect(() => {
    function initialize(error: any) {
      maxRetryCount.current = 0;
      return Promise.reject(error);
    }

    async function processLogout(error: any) {
      await snapApi.post('/auth/logout');
      localStorage.removeItem('access_token');
      router.push('/auth/login');
      return initialize(error);
    }

    snapApi.interceptors.response.use(
      (response) => {
        // 요청 완료 시 Map에서 제거
        const requestKey = getRequestKey(response.config);
        requestMap.delete(requestKey);
        if (requestKey === 'POST_/auth/logout_{}') {
          Object.assign(snapApi, {
            get: originalMethod.current.get,
            post: originalMethod.current.post,
            put: originalMethod.current.put,
            delete: originalMethod.current.delete,
            patch: originalMethod.current.patch,
            options: originalMethod.current.options,
            head: originalMethod.current.head,
          });
        }
        return response;
      },
      async (error) => {
        if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
          return Promise.reject(error);
        }

        if (error.response) {
          if (error.response.status === 401) {
            // console.log('🔥 401이잖아?', error.response.data);
            if (!error.response.data) {
              return processLogout(error);
            }

            if (error.response.data.name === 'UnauthorizedException') {
              return processLogout(error);
            }

            if (error.response.data.name === 'ExpiredTokenExceptionDto') {
              if (maxRetryCount.current < MAX_RETRY_COUNT) {
                try {
                  maxRetryCount.current++;

                  const res = await snapApi.post('/auth/refresh');
                  const accessToken = res.data.payload.accessToken;

                  if (accessToken) {
                    localStorage.setItem('access_token', accessToken);
                  }
                } catch (error: any) {
                  // console.log('🔥 refresh 실패?', error.response.data);
                  if (error.response.data.name === 'RefreshTokenRequiredExceptionDto') {
                    return processLogout(error);
                  }
                  return initialize(error);
                }

                try {
                  error.config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
                  const result = snapApi(error.config);
                  maxRetryCount.current = 0;
                  return Promise.resolve(result);
                } catch {
                  return initialize(error);
                }
              } else {
                return processLogout(error);
              }
            }
          }
        }

        return Promise.reject(error);
      },
    );
  }, []);

  // 컴포넌트 언마운트 시 모든 활성 요청 취소
  useEffect(() => {
    return () => {
      requestMap.forEach((controller) => {
        controller.abort();
      });
      requestMap.clear();
    };
  }, []);

  return <AxiosContext.Provider value={snapApi}>{children}</AxiosContext.Provider>;
};
