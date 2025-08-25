import { UserRole, UserRoleList } from '@share/enums/user-role';

export const roleAtLeast = (atLeastRole: UserRole, role?: UserRole) => {
  return role ? UserRoleList.indexOf(role) >= UserRoleList.indexOf(atLeastRole) : false;
};
