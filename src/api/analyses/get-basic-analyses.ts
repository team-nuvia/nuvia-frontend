import { snapApi } from '..';

export const getBasicAnalyses = async (surveyId: string): Promise<ServerResponse<AnalysisPageData>> => {
  const response = await snapApi.get(`/analyses/basic/${surveyId}`);
  return response.data;
};
