import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { SurveyStatus } from '@share/enums/survey-status';
import { AllQuestion } from '@share/interface/iquestion';
import { GetCategoryResponse } from './GetCategoryResponse';

export interface QuestionOptionDetailNestedResponseDto {
  id: number;
  label: string;
}

export interface QuestionDetailNestedResponseDto extends Omit<AllQuestion, 'options'> {
  id: number;
  title: string;
  description: string | null;
  isRequired: boolean;
  questionType: QuestionType;
  dataType: DataType;
  options: QuestionOptionDetailNestedResponseDto[];
}

export interface GetSurveyDetailResponse {
  id: number;
  category: GetCategoryResponse;
  title: string;
  description: string | null;
  author: {
    name: string;
    profileUrl: string;
  };
  estimatedTime: number;
  totalResponses: number;
  questions: QuestionDetailNestedResponseDto[];
  isPublic: boolean;
  status: SurveyStatus;
  questionCount: number;
  respondentCount: number;
  isOwner: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
