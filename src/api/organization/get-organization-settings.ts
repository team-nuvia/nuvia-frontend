import { GetOrganizationSettingsResponse } from '@/models/GetOrganizationSettingsResponse';
import { snapApi } from '..';

export async function getOrganizationSettings(subscriptionId: number) {
  const response = await snapApi.get<ServerResponse<GetOrganizationSettingsResponse>>(`/subscriptions/${subscriptionId}/settings`);
  return response.data;
}
