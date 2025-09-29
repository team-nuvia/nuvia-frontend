import { snapApi } from '..';

export const updateUserOrganization = async (organizationId: number): Promise<ServerResponse<void>> => {
  const response = await snapApi.patch<ServerResponse<void>>('/users/me/organizations', {
    organizationId,
  });
  return response.data;
};
