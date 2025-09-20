import { ICategory } from '@share/interface/icategory';
import { AllQuestion } from '@share/interface/iquestion';
import { ISurvey } from '@share/interface/isurvey';

// export interface QuestionOptionDetailNestedResponseDto {
//   id: number;
//   idx: number;
//   label: string;
//   description: string | null;
//   sequence: number;
// }

// export interface QuestionDetailNestedResponseDto extends Omit<AllQuestion, 'questionOptions'> {
//   id: number;
//   title: string;
//   description: string | null;
//   isRequired: boolean;
//   questionType: QuestionType;
//   dataType: DataType;
//   questionOptions: QuestionOptionDetailNestedResponseDto[];
// }

// export interface GetSurveyDetailResponse {
//   id: number;
//   category: GetCategoryResponse;
//   title: string;
//   description: string | null;
//   author: {
//     name: string;
//     profileUrl: string;
//   };
//   estimatedTime: number;
//   totalResponses: number;
//   questions: QuestionDetailNestedResponseDto[];
//   isPublic: boolean;
//   status: SurveyStatus;
//   questionCount: number;
//   respondentCount: number;
//   isOwner: boolean;
//   expiresAt: Date | null;
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface GetSurveyDetailResponse extends Omit<ISurvey, 'questions' | 'categoryId' | 'expiresAt'> {
  category: ICategory;
  questions: Omit<AllQuestion, 'questionAnswers' | 'isAnswered'>[];
  expiresAt: Date | null;
}
