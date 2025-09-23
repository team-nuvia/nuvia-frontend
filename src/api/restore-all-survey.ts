import { snapApi } from '.';

export const restoreAllSurvey = async () => {
  const response = await snapApi.patch(`/surveys/restore-all`);
  return response.data;
};
