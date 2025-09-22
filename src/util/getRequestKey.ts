import { AxiosRequestConfig } from 'axios';

export const getRequestKey = (config: AxiosRequestConfig) => {
  return `${config.method?.toUpperCase()}_${config.url}_${JSON.stringify(config.params || {})}`;
};
