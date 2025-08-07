import { SurveyStatus } from '@share/enums/survey-status';
import { IQuestionWithoutId } from '@share/interface/iquestion';

export interface CreateSurveyPayload {
  title: string;
  description: string;
  expiresAt: Date | null;
  isPublic: boolean;
  status: SurveyStatus;
  questions: IQuestionWithoutId[];
}
