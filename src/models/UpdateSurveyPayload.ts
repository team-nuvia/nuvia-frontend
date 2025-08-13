import { IQuestion, IQuestionOption } from '@share/interface/iquestion';
import { CreateSurveyPayload } from './CreateSurveyPayload';

export interface UpdateSurveyPayload {
  surveyFormData: Omit<CreateSurveyPayload, 'questions'>;
  surveyQuestionData: (Omit<IQuestion, 'idx' | 'isAnswered' | 'answers' | 'questionOptions'> & {
    questionOptions: Omit<IQuestionOption, 'idx'>[];
  })[];
}
