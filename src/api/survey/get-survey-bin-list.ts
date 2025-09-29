import { GetPaginatedResponse } from '@/models/GetPaginatedResponse';
import { GetSurveyBinListResponse } from '@/models/GetSurveyBinListResponse';
import { snapApi } from '..';

export const getSurveyBinList = async ({
  page,
  limit,
  search,
}: Partial<{
  page: number;
  limit: number;
  search: string;
}>): Promise<ServerResponse<GetPaginatedResponse<GetSurveyBinListResponse>>> => {
  const queryString = new URLSearchParams({
    page: page?.toString() ?? '',
    limit: limit?.toString() ?? '',
    search: search ?? '',
  });
  const response = await snapApi.get<ServerResponse<GetPaginatedResponse<GetSurveyBinListResponse>>>(`/surveys/bin?${queryString.toString()}`);
  return response.data;
};
