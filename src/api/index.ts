import { requestMap } from '@/store/request.store';
import { API_URL } from '@common/variables';
import { getRequestKey } from '@util/getRequestKey';
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

    // 요청 키 생성 (URL + 메서드 + 파라미터)
    const requestKey = getRequestKey(config);

    // 기존 요청이 있다면 취소
    // if (activeRequests.current.size > 0 && !activeRequests.current.has('POST_/auth/logout_{}')) {
    if (requestMap.has(requestKey)) {
      requestMap.get(requestKey)?.abort();
    }

    if (requestMap.has('POST_/auth/logout_{}')) {
      Object.assign(snapApi, {
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
