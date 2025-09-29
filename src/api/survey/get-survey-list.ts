import { GetPaginatedResponse } from '@/models/GetPaginatedResponse';
import { SearchSurvey } from '@share/interface/search-survey';
import { snapApi } from '..';

export const getSurveyList = async ({
  page,
  limit,
  search,
  status,
}: Partial<{
  page: number;
  limit: number;
  search: string;
  status: string;
}>): Promise<ServerResponse<GetPaginatedResponse<SearchSurvey>>> => {
  const queryString = new URLSearchParams({
    page: page?.toString() ?? '',
    limit: limit?.toString() ?? '',
    search: search ?? '',
    status: status ?? '',
  });
  const response = await snapApi.get<ServerResponse<GetPaginatedResponse<SearchSurvey>>>(`/surveys?${queryString.toString()}`);
  return response.data;
};
