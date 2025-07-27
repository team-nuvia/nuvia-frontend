'use client';

import { API_URL } from '@common/variables';
import axios from 'axios';

export const snapApi = axios.create({
  baseURL: API_URL,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  fetchOptions: {
    credentials: 'include',
    mode: 'cors',
    keepalive: true,
  },
});
