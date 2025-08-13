import { SearchSurvey } from '@share/interface/search-survey';
import { snapApi } from '.';

export interface GetSurveyListResponse {
  page: number;
  limit: number;
  total: number;
  data: SearchSurvey[];
}

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
}>): Promise<ServerResponse<GetSurveyListResponse>> => {
  const queryString = new URLSearchParams({
    page: page?.toString() ?? '',
    limit: limit?.toString() ?? '',
    search: search ?? '',
    status: status ?? '',
  });
  const response = await snapApi.get<ServerResponse<GetSurveyListResponse>>(`/surveys?${queryString.toString()}`);
  return response.data;
};
