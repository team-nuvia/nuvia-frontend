import { GetDashboardMetadataResponse } from '@/models/GetDashboardMetadataResponse';
import { snapApi } from '.';

export async function getDashboardMetadataServer(): Promise<ServerResponse<GetDashboardMetadataResponse>> {
  const response = await snapApi.get<ServerResponse<GetDashboardMetadataResponse>>('/surveys/metadata');
  return response.data;
}
