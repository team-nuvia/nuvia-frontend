import { PlanNameType } from '@share/enums/plan-name-type.enum';
import { IOrganization } from '@share/interface/iorganization';
import { snapApi } from '.';

type IOrganizationWithPlanName = Omit<IOrganization, 'plan'> & {
  plan: PlanNameType;
};

export interface IGetUserOrganizationsResponse {
  currentOrganization: IOrganizationWithPlanName;
  organizations: IOrganizationWithPlanName[];
}

export const getUserOrganizations = async (): Promise<ServerResponse<IGetUserOrganizationsResponse>> => {
  const response = await snapApi.get<ServerResponse<IGetUserOrganizationsResponse>>('/users/me/organizations');
  return response.data;
};
