import { UserRole } from '@share/enums/user-role';

export interface GetMeResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
