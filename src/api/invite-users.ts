import { snapApi } from '.';

export const inviteUsers = async (subscriptionId: number, emails: string[]): Promise<ServerResponse<null>> => {
  const response = await snapApi.post(`/subscriptions/${subscriptionId}/invite`, { emails });
  return response.data;
};
