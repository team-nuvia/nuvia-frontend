import { UserRole } from '@share/enums/user-role';

export interface GetMeResponse {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
