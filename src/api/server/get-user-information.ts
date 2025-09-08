import { GetMeResponse } from '@/models/GetMeResponse';
import { API_URL } from '@common/variables';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function getUserInformation() {
  const refreshToken = (await cookies()).get('refresh_token')?.value;
  try {
    const verifyResponse = await axios.post(
      `${API_URL}/auth/verify`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          'cache-control': 'no-cache',
        },
      },
    );

    if (verifyResponse.status !== 200 && verifyResponse.status !== 201) return null;
  } catch (error) {
    return null;
  }

  try {
    const userResponse = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        'cache-control': 'no-cache',
      },
    });
    const userJson = await userResponse.data;

    if (userResponse.status !== 200 && userResponse.status !== 201) return null;

    return userJson.payload as GetMeResponse; // { user: {...} }
  } catch (error) {
    return null;
  }
}
