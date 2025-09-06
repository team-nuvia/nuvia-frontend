import { snapApi } from '.';

export const restoreAllSurvey = async () => {
  const response = await snapApi.post(`/surveys/restore-all`);
  return response.data;
};
