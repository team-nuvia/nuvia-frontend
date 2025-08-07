import { GetDashboardSurveyNestedResponseDto } from '@/models/GetDashboardSurveyNestedResponseDto';
import { snapApi } from '.';

export async function getDashboardSurveyList(): Promise<GetDashboardSurveyNestedResponseDto[]> {
  const response = await snapApi.get<GetDashboardSurveyNestedResponseDto[]>('/surveys/me');
  return response.data;
}
