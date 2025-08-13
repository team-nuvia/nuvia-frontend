import { SurveyStatus } from '@share/enums/survey-status';
import { GetCategoryResponse } from './GetCategoryResponse';

export interface GetDashboardSurveyNestedResponseDto {
  id: number;
  category: GetCategoryResponse;
  title: string;
  description: string | null;
  isPublic: boolean;
  status: SurveyStatus;
  questionCount: number;
  respondentCount: number;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
