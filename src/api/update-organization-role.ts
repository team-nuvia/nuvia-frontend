import { snapApi } from '.';

export const updateOrganizationRole = async (subscriptionId: number, organizationId: number, values: { role: string; status: string }) => {
  const response = await snapApi.patch(`/subscriptions/${subscriptionId}/organization-roles/${organizationId}`, values);
  return response.data;
};
