'use client';

export const SERVER_HOST = process.env.NEXT_PUBLIC_SERVER_HOST;
export const SERVER_PORT = process.env.NEXT_PUBLIC_SERVER_PORT;
// export const API_URL = `http://${SERVER_HOST}:${SERVER_PORT}`;
export const API_URL = '/api/v1';

export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME as string;
export const LOGO_ONLY = process.env.NEXT_PUBLIC_LOGO_ONLY as string;
export const LOGO_ONLY_SVG = process.env.NEXT_PUBLIC_LOGO_ONLY_SVG as string;
