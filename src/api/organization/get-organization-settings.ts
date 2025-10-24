import { GetOrganizationSettingsResponse } from '@/models/GetOrganizationSettingsResponse';
import { snapApi } from '..';

export async function getOrganizationSettings() {
  const response = await snapApi.get<ServerResponse<GetOrganizationSettingsResponse>>('/organizations/me/settings');
  return response.data;
}
