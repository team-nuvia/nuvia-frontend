import { GetCategoryResponse } from '@/models/GetCategoryResponse';
import { snapApi } from '..';

export const getCategories = async () => {
  const response = await snapApi.get<ServerResponse<GetCategoryResponse[]>>('/surveys/categories');
  return response.data;
};
