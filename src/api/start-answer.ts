import { snapApi } from '.';

export const startAnswer = async ({ surveyId }: { surveyId: number }) => {
  const response = await snapApi.post<ServerResponse<null>>(`/surveys/${surveyId}/answers/start`, {
    userAgent: navigator.userAgent,
  });
  return response.data;
};
