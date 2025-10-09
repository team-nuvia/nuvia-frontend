import { requestMap } from '@/store/request.store';
import { API_URL } from '@common/variables';
import { getRequestKey } from '@util/getRequestKey';
import axios from 'axios';
import { cookies } from 'next/headers';

const MAX_RETRY_COUNT = 10;

axios.defaults.withCredentials = true;

export const serverApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1 * 60 * 1000,
});

const originalMethod = {
  get: serverApi.get,
  post: serverApi.post,
  put: serverApi.put,
  delete: serverApi.delete,
  patch: serverApi.patch,
  options: serverApi.options,
  head: serverApi.head,
};

serverApi.interceptors.request.use(
  async (config) => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();
    config.headers.Cookie = cookieHeader;
    // const accessToken = localStorage.getItem('access_token');
    // if (accessToken) {
    //   config.headers.Authorization = `Bearer ${accessToken}`;
    // }

    // 요청 키 생성 (URL + 메서드 + 파라미터)
    const requestKey = getRequestKey(config);

    // 기존 요청이 있다면 취소
    // if (activeRequests.current.size > 0 && !activeRequests.current.has('POST_/auth/logout_{}')) {
    if (requestMap.has(requestKey)) {
      requestMap.get(requestKey)?.abort();
    }

    if (requestMap.has('POST_/auth/logout_{}')) {
      Object.assign(serverApi, {
        get: () => {},
        post: () => {},
        put: () => {},
        delete: () => {},
        patch: () => {},
        options: () => {},
        head: () => {},
      });
    }

    // 새로운 AbortController 생성
    const abortController = new AbortController();
    requestMap.set(requestKey, abortController);
    config.signal = abortController.signal;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let maxRetryCount = 0;

function initialize(error: any) {
  maxRetryCount = 0;
  return Promise.reject(error);
}

async function processLogout(error: any) {
  await serverApi.post('/auth/logout');
  return initialize(error);
}

serverApi.interceptors.response.use(
  (response) => {
    // 요청 완료 시 Map에서 제거
    const requestKey = getRequestKey(response.config);
    requestMap.delete(requestKey);
    if (requestKey === 'POST_/auth/logout_{}') {
      Object.assign(serverApi, {
        get: originalMethod.get,
        post: originalMethod.post,
        put: originalMethod.put,
        delete: originalMethod.delete,
        patch: originalMethod.patch,
        options: originalMethod.options,
        head: originalMethod.head,
      });
    }
    return response;
  },
  async (error) => {
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
      return Promise.reject(error);
    }

    if (error.response) {
      if (!error.response.data || error.response.message === 'NotFoundUserExceptionDto') {
        return processLogout(error);
      }

      if (error.response.status === 401) {
        // console.log('🔥 401이잖아?', error.response.data);

        if (['ExpiredTokenExceptionDto', 'UnauthorizedException'].includes(error.response.data.name)) {
          if (maxRetryCount < MAX_RETRY_COUNT) {
            try {
              maxRetryCount++;
              console.log('여기냐');

              await serverApi.post('/auth/refresh');
              maxRetryCount = 0;
            } catch (error: any) {
              if (error.response.data.name === 'RefreshTokenRequiredExceptionDto') {
                return processLogout(error);
              }
              if (error.response.data.name === 'NotFoundUserExceptionDto') {
                return processLogout(error);
              }
              return initialize(error);
            }

            try {
              const result = serverApi(error.config);
              maxRetryCount = 0;
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
