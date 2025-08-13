import { GetMeSettingsResponse } from '@/models/GetMeSettingsResponse';
import { snapApi } from '.';

export async function getUserSettings(): Promise<ServerResponse<GetMeSettingsResponse>> {
  const response = await snapApi.get<ServerResponse<GetMeSettingsResponse>>('/users/me/settings');
  return response.data;
}
