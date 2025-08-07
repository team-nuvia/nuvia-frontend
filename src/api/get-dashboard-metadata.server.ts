import { GetDashboardMetadataResponse } from '@/models/GetDashboardMetadataResponse';
import { snapApi } from '.';

export async function getDashboardMetadata(): Promise<ServerResponse<GetDashboardMetadataResponse>> {
  const response = await snapApi.get<ServerResponse<GetDashboardMetadataResponse>>('/dashboard/metadata');
  return response.data;
}
