import { snapApi } from '.';

export const deleteSurvey = async ({ surveyId }: { surveyId: string }): Promise<ServerResponse<void>> => {
  const response = await snapApi.delete(`/surveys/${surveyId}`);
  return response.data;
};
