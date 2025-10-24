import { GetSurveyDetailResponse } from '@/models/GetSurveyDetailResponse';
import { API_URL } from '@common/variables';
import axios from 'axios';
import { cookies } from 'next/headers';

export const getSurveyDetailView = async (hashedUniqueKey: string) => {
  const response = await axios.get<ServerResponse<GetSurveyDetailResponse>>(`/surveys/view/${hashedUniqueKey}`, {
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      cookie: (await cookies()).toString(),
    },
    timeout: 1 * 60 * 1000,
  });
  return response.data;
};
