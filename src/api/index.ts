'use client';

import { API_URL } from '@common/variables';
import axios from 'axios';

interface SnapApiProps extends RequestInit {
  url: string;
  errorMessage?: string;
}

interface SnapApiWithBodyProps<T> extends Omit<SnapApiProps, 'body'> {
  body?: T;
}

const commonHeaders: Pick<RequestInit, 'headers' | 'credentials' | 'mode'> = {
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  mode: 'no-cors',
};

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
  ...commonHeaders,
});
