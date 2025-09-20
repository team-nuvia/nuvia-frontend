import { SurveyStatus } from '@share/enums/survey-status';
import { IQuestionWithoutId } from '@share/interface/iquestion';

export interface CreateSurveyPayload {
  categoryId: number;
  title: string;
  description: string | null;
  expiresAt: Date | null;
  isPublic: boolean;
  status: SurveyStatus;
  questions: Omit<IQuestionWithoutId, 'idx' | 'questionAnswers' | 'isAnswered'>[];
}
