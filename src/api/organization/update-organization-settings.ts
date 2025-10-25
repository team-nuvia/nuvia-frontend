import { ResponseFormat } from '@share/enums/response-format';
import { UserRole } from '@share/enums/user-role';
import { snapApi } from '..';

export interface UpdateOrganizationSettingsPayload {
  teamName?: string;
  teamDescription?: string;
  teamDefaultRole?: UserRole;
  responseFormat?: ResponseFormat;
}

export async function updateOrganizationSettings(
  subscriptionId: number,
  { teamName, teamDescription, teamDefaultRole, responseFormat }: UpdateOrganizationSettingsPayload,
) {
  const response = await snapApi.patch<ServerResponse<void>>(`/subscriptions/${subscriptionId}/settings`, {
    teamName,
    teamDescription,
    teamDefaultRole,
    responseFormat,
  });
  return response.data;
}
