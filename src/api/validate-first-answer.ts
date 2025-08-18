import { snapApi } from '.';

export const validateFirstSurveyAnswer = async (surveyId: number) => {
  const response = await snapApi.post(`/surveys/${surveyId}/answers/validate`);
  return response.data;
};
