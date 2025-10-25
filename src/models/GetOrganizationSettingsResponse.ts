import { ResponseFormat } from '@share/enums/response-format';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';
import { UserRole } from '@share/enums/user-role';

export interface GetOrganizationSettingsResponse {
  teamName: string;
  teamDescription: string | null;
  teamDefaultRole: UserRole;
  responseFormat: ResponseFormat;
  teamTarget: SubscriptionTargetType;
}
