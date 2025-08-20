import { AnswerStatus } from '@share/enums/answer-status';

export interface AnswerPayload {
  answers: AnswerEachPayload[];
  status: AnswerStatus;
}

export interface AnswerEachPayload {
  questionId: number;
  optionIds?: number[] | null;
  value?: string | null;
}
