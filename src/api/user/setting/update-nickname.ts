import { snapApi } from "@api/index";

export const updateNickname = async (nickname: string) => {
  const response = await snapApi.patch<ServerResponse<void>>('/users/me', {
    nickname,
  });
  return response.data;
};