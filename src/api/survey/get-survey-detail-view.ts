import { PreviewPayload } from '@/models/PreviewPayload';
import { snapApi } from '..';

export const getSurveyDetailView = async (hashedUniqueKey: string) => {
  const response = await snapApi.get<ServerResponse<PreviewPayload>>(`/surveys/view/${hashedUniqueKey}`);
  return response.data;
};
