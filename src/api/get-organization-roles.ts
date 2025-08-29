import { GetOrganizationRolesResponse } from '@/models/GetOrganizationRoles';
import { snapApi } from '.';

export const getOrganizationRoles = async (subscriptionId: number): Promise<ServerResponse<GetOrganizationRolesResponse[]>> => {
  const response = await snapApi.get(`/subscriptions/${subscriptionId}/organization-roles`);
  return response.data;
};
