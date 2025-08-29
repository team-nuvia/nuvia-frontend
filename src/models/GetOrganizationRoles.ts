import { SubscriptionStatusType } from '@share/enums/subscription-status-type';
import { UserRole } from '@share/enums/user-role';

export interface GetOrganizationRolesResponse {
  id: number;
  name: string;
  email: string;
  status: SubscriptionStatusType;
  role: UserRole;
  createdAt: Date;
}
