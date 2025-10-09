import { ISurvey } from '@share/interface/isurvey';
import { serverApi } from '.';

export const getDashboardRecentSurveysServer = async () => {
  const response = await serverApi.get<
    ServerResponse<
      (Pick<ISurvey, 'id' | 'title' | 'description' | 'status' | 'createdAt' | 'updatedAt' | 'hashedUniqueKey' | 'expiresAt' | 'author'> & {
        responses: number;
      })[]
    >
  >('/surveys/recent');
  return response.data;
};
