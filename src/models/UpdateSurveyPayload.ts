import { IQuestion, IQuestionOption } from '@share/interface/iquestion';
import { CreateSurveyPayload } from './CreateSurveyPayload';

export interface UpdateSurveyPayload {
  surveyFormData: Omit<CreateSurveyPayload, 'questions'>;
  surveyQuestionData: (Omit<IQuestion, 'idx' | 'isAnswered' | 'questionAnswers' | 'questionOptions'> & {
    questionOptions: Omit<IQuestionOption, 'idx'>[];
  })[];
}
