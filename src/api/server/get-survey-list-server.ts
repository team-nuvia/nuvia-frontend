import { GetPaginatedResponse } from '@/models/GetPaginatedResponse';
import { SearchSurvey } from '@share/interface/search-survey';
import { serverApi } from '.';

export const getSurveyListServer = async ({
  page,
  limit,
  search,
  status,
}: {
  page: number;
  limit: number;
  search: string;
  status: string;
}): Promise<ServerResponse<GetPaginatedResponse<SearchSurvey>>> => {
  const queryString = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search,
    status: status,
  });
  const response = await serverApi.get(`/surveys?${queryString.toString()}`);
  return response.data;
};
