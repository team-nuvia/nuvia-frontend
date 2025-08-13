import { UpdateSurveyPayload } from '@/models/UpdateSurveyPayload';
import { snapApi } from '.';

export const updateSurvey = async (id: string, surveyData: UpdateSurveyPayload) => {
  const response = await snapApi.put(`/surveys/${id}`, surveyData);
  return response.data;
};
