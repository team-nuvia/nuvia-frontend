import { SocialProvider } from '@share/enums/social-provider.enum';
import { UserRole } from '@share/enums/user-role';
import { IOrganization } from '@share/interface/iorganization';

export interface GetMeResponse {
  id: number;
  email: string;
  name: string;
  nickname: string;
  role: UserRole;
  provider: SocialProvider;
  currentOrganization: IOrganization;
  createdAt: Date;
  updatedAt: Date;
  lastAccessAt: Date | null;
  profileImageUrl: string | null;
}
