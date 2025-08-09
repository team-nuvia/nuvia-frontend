import { GetSurveyDetailResponse } from '@/models/GetSurveyDetailResponse';
import { snapApi } from '.';

export const getSurveyDetail = async (surveyId: string) => {
  const response = await snapApi.get<ServerResponse<GetSurveyDetailResponse>>(`/surveys/${surveyId}`);
  return response.data;
};
