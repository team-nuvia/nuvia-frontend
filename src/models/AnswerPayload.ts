export interface AnswerPayload {
  answers: AnswerEachPayload[];
}

export interface AnswerEachPayload {
  questionId: number;
  optionIds?: number[] | null;
  value?: string | null;
}
