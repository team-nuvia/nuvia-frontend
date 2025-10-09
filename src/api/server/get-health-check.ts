import { API_URL } from '@common/variables';

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
    const response = await fetch(`${API_URL}/health`, {
      method: 'HEAD',
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.json();
  } catch (error) {
    return error;
  }
}
