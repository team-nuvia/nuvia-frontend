export const RenderPageTag = {
  AnswerStart: 'answer-start',
  AnswerContinue: 'answer-continue',
  Login: 'login',
  AnswerOwnerMigrated: 'answer-owner-migrated',
  NoVerifyAccessToken: 'no-verify-access-token',
  RequiredRefreshJws: 'required-refresh-jws',
  NotFoundSurvey: 'not-found-survey',
  NotFoundAnswer: 'not-found-answer',
  ExpiredJws: 'expired-jws',
  ExpiredAnswer: 'expired-answer',
} as const;
export type RenderPageTag = (typeof RenderPageTag)[keyof typeof RenderPageTag];
export const RenderPageTagList = Object.values(RenderPageTag);
