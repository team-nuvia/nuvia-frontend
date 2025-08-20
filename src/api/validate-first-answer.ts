import { ValidateFirstAnswerResponse } from '@/models/ValidateFirstAnswerResponse';
import { snapApi } from '.';

export const validateFirstSurveyAnswer = async (surveyId: number): Promise<ServerResponse<ValidateFirstAnswerResponse>> => {
  const response = await snapApi.post(`/surveys/${surveyId}/answers/validate`);
  return response.data;
};
