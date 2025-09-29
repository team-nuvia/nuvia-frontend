import { snapApi } from '..';

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const changePassword = async (data: ChangePasswordData): Promise<ServerResponse<void>> => {
  const { currentPassword, newPassword, confirmPassword } = data;

  if (newPassword !== confirmPassword) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  const response = await snapApi.patch('/users/me/password', {
    currentPassword,
    newPassword,
    confirmPassword,
  });
  return response.data;
};
