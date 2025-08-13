import { GetSurveyDetailResponse } from '@/models/GetSurveyDetailResponse';
import { snapApi } from '.';

export const getSurveyDetailView = async (hashedUniqueKey: string) => {
  const response = await snapApi.get<ServerResponse<GetSurveyDetailResponse>>(`/surveys/view/${hashedUniqueKey}`);
  console.log('🚀 ~ getSurveyDetailView ~ response:', response.data);
  return response.data;
};
