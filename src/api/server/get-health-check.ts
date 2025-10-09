import { snapApi } from '..';

export async function getHealthCheck() {
  try {
    await fetch('https://one.one.one.one/', {
      mode: 'no-cors',
      method: 'HEAD',
      cache: 'no-cache',
    });
  } catch (error) {
    throw error;
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    const response = await snapApi.head('/health', {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.data;
  } catch (error) {
    return error;
  }
}
