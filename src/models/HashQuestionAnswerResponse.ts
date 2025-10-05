export interface QuestionAnswerFileNestedResponseDto {
  id: number;
  originalname: string;
  filename: string;
  mimetype: string;
  size: number;
  buffer: any;
  createdAt: Date;
}

export interface HashQuestionAnswerResponse {
  id: number;
  questionId: number;
  questionOptionId: number | null;
  value: string | null;
  referenceBuffer: QuestionAnswerFileNestedResponseDto | null;
}
