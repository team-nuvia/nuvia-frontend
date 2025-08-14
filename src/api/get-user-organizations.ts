import { IOrganization } from '@share/interface/iorganization';
import { snapApi } from '.';

export interface IGetUserOrganizationsResponse {
  currentOrganization: IOrganization;
  organizations: IOrganization[];
}

export const getUserOrganizations = async (): Promise<ServerResponse<IGetUserOrganizationsResponse>> => {
  const response = await snapApi.get<ServerResponse<IGetUserOrganizationsResponse>>('/users/me/organizations');
  return response.data;
};
