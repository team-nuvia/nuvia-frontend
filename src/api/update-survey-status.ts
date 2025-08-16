import { snapApi } from '@/api';
import { SurveyStatus } from '@share/enums/survey-status';

export const updateSurveyStatus = async (surveyId: number, status: SurveyStatus): Promise<ServerResponse<void>> => {
  const response = await snapApi.patch(`/surveys/${surveyId}/status`, { status });
  return response.data;
};
