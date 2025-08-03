import { IQuestionWithoutId } from '@share/interface/iquestion';

export interface CreateSurveyPayload {
  title: string;
  description: string;
  expiresAt: Date | null;
  isPublic: boolean;
  questions: IQuestionWithoutId[];
}
