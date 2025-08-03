import { CreateSurveyPayload } from '@/models/CreateSurveyPayload';
import { snapApi } from '.';

export const createSurvey = async (data: CreateSurveyPayload): Promise<ServerResponse<null>> => {
  const response = await snapApi.post('/surveys', data);
  return response.data;
};
