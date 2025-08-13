import { snapApi } from '@/api';

export async function toggleSurveyVisibility({ surveyId, isPublic }: { surveyId: number; isPublic: boolean }): Promise<ServerResponse<void>> {
  const response = await snapApi.patch<ServerResponse<void>>(`/surveys/${surveyId}/visibility`, { isPublic });
  return response.data;
}
