import { ISurvey } from '@share/interface/isurvey';
import { snapApi } from '..';

export const getDashboardRecentSurveysServer = async () => {
  const response = await snapApi.get<
    ServerResponse<(Pick<ISurvey, 'id' | 'title' | 'description' | 'status' | 'createdAt' | 'updatedAt' | 'hashedUniqueKey' | 'expiresAt' | 'author'> & { responses: number })[]>
  >('/surveys/recent');
  return response.data;
};
