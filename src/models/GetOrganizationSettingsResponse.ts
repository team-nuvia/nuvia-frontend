import { UserRole } from '@share/enums/user-role';

export interface GetOrganizationSettingsResponse {
  teamName: string;
  teamDescription: string | null;
  teamDefaultRole: UserRole;
}
