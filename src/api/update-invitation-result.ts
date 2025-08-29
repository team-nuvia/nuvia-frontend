import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { snapApi } from '.';

export const updateInvitationResult = async (subscriptionId: number, notificationId: number, status: OrganizationRoleStatusType) => {
  const response = await snapApi.patch<ServerResponse<any>>(`/subscriptions/${subscriptionId}/invite`, {
    notificationId,
    status,
  });
  return response.data;
};
