import { PreviewPayload } from '@/models/PreviewPayload';
import { API_URL } from '@common/variables';
import axios from 'axios';
import { cookies } from 'next/headers';

const getAccessToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('refresh_token')?.value;
};

export const getSurveyDetailView = async (hashedUniqueKey: string) => {
  const accessToken = await getAccessToken();

  const response = await axios.get<ServerResponse<PreviewPayload>>(`/surveys/view/${hashedUniqueKey}`, {
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    timeout: 1 * 60 * 1000,
  });
  return response.data;
};
