import { AnswerPayload } from '@/models/AnswerPayload';
import { snapApi } from '..';

export const createAnswer = async (surveyId: number, answers: AnswerPayload) => {
  const response = await snapApi.post(`/surveys/${surveyId}/answers`, answers, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
