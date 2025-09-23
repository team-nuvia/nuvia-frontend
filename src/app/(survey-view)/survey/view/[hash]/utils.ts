import { GetSurveyDetailResponse } from '@/models/GetSurveyDetailResponse';
import { API_URL } from '@common/variables';
import axios from 'axios';
import { cookies } from 'next/headers';

const getAccessToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('refresh_token')?.value;
};

const getSubmissionHash = async () => {
  const cookieStore = await cookies();
  const header = cookieStore.get('X-Client-Hash')?.value;
  return `X-Client-Hash=${header}`;
};

export const getSurveyDetailView = async (hashedUniqueKey: string) => {
  const accessToken = await getAccessToken();
  const header = await getSubmissionHash();

  const response = await axios.get<ServerResponse<GetSurveyDetailResponse>>(`/surveys/view/${hashedUniqueKey}`, {
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      cookie: header,
    },
    timeout: 1 * 60 * 1000,
  });
  return response.data;
};
