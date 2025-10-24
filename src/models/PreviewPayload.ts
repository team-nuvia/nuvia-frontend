import { SurveyStatus } from '@share/enums/survey-status';
import { ICategory } from '@share/interface/icategory';
import { IQuestion } from '@share/interface/iquestion';

export interface PreviewPayload {
  id: number | null;
  hashedUniqueKey: string;
  subscriptionId: number;
  category: ICategory;
  viewCount: number;
  title: string;
  description: string | null;
  author: {
    id: number;
    name: string;
    profileImage: string | null;
  };
  estimatedTime: number;
  totalResponses: number;
  questions: IQuestion[];
  questionAnswers: {
    questionId: number;
    questionOptionId: number | null;
    value: string | null;
  }[];
  isPublic: boolean;
  status: SurveyStatus;
  questionCount: number;
  respondentCount: number;
  isOwner: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
