import { snapApi } from '.';

export const restoreSurvey = async (surveyId: string) => {
  const response = await snapApi.patch(`/surveys/${surveyId}/restore`);
  return response.data;
};
