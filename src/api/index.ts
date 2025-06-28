'use client';

import { API_URL } from '@common/variables';
import axios from 'axios';

// interface SnapApiProps extends RequestInit {
//   url: string;
//   errorMessage?: string;
// }

// interface SnapApiWithBodyProps<T> extends Omit<SnapApiProps, 'body'> {
//   body?: T;
// }

// const commonHeaders: Pick<RequestInit, 'headers'> = {
//   headers: { 'Content-Type': 'application/json' },
// };

// export const snapApi = {
//   async get(options: SnapApiProps) {
//     const response = await fetch(`${API_URL}${options.url}`, {
//       method: 'GET',
//       ...commonHeaders,
//       ...options,
//     });
//     return response.json();
//   },
//   async post<T>(options: SnapApiWithBodyProps<T>) {
//     const response = await fetch(`${API_URL}${options.url}`, {
//       method: 'POST',
//       ...commonHeaders,
//       ...options,
//       body: JSON.stringify(options.body),
//     });
//     return response.json();
//   },
//   async patch<T>(options: SnapApiWithBodyProps<T>) {
//     const response = await fetch(`${API_URL}${options.url}`, {
//       method: 'PATCH',
//       ...commonHeaders,
//       ...options,
//       body: JSON.stringify(options.body),
//     });
//     return response.json();
//   },
//   async put<T>(options: SnapApiWithBodyProps<T>) {
//     const response = await fetch(`${API_URL}${options.url}`, {
//       method: 'PUT',
//       ...commonHeaders,
//       ...options,
//       body: JSON.stringify(options.body),
//     });
//     return response.json();
//   },
//   async delete(options: SnapApiProps) {
//     const response = await fetch(`${API_URL}${options.url}`, {
//       method: 'DELETE',
//       ...commonHeaders,
//       ...options,
//     });
//     return response.json();
//   },
// };

export const snapApi = axios.create({
  url: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// snapApi.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// snapApi.interceptors.response.use((response) => {
//   if (response.status === 401) {
//     localStorage.removeItem('token');
//     window.location.href = '/login';
//   }
//   return response;
// });
