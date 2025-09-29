import { snapApi } from '@api/index';

export const verifyInvitationToken = async (token: string) => {
  const response = await snapApi.post('/auth/verify/invitation', { token });
  return response.data;
};
