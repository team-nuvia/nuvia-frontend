import { GetPlansModel } from '@/models/GetPlansModel';
import { snapApi } from '..';

export const getPlans = async (): Promise<ServerResponse<GetPlansModel[]>> => {
  const response = await snapApi.get('/plans');
  return response.data;
};
