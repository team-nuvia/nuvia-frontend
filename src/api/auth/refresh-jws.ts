import { snapApi } from '..';

export const refreshJws = async (surveyId: number) => {
  const response = await snapApi.post(`/surveys/${surveyId}/answers/refresh`);
  return response.data;
};
