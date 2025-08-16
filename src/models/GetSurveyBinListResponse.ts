import { SurveyStatus } from '@share/enums/survey-status';

export interface GetSurveyBinListResponse {
  id: number;
  title: string;
  description: string | null;
  isPublic: boolean;
  status: SurveyStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
