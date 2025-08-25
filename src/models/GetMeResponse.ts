import { UserRole } from '@share/enums/user-role';
import { IOrganization } from '@share/interface/iorganization';

export interface GetMeResponse {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  currentOrganization: IOrganization;
  createdAt: string;
  updatedAt: string;
  profileImageUrl: string | null;
}
