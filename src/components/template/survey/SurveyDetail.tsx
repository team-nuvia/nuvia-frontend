'use client';

import NotFound from '@/app/(survey-view)/survey/view/[hash]/not-found';
import { GetSurveyDetailResponse } from '@/models/GetSurveyDetailResponse';
import { useAuthStore } from '@/store/auth.store';
import mutationKeys from '@/store/lib/mutation-key';
import { refreshJws } from '@api/auth/refresh-jws';
import { startAnswer } from '@api/survey/start-answer';
import { validateFirstSurveyAnswer } from '@api/survey/validate-first-answer';
import { RenderPageTag } from '@common/enums';
import ActionButton from '@components/atom/ActionButton';
import OutlineBox from '@components/atom/OutlineBox';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import { PlayArrow, QuestionMark, Timer } from '@mui/icons-material';
import { Alert, Chip, Container, Stack, Typography } from '@mui/material';
import { QuestionType } from '@share/enums/question-type';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, CanceledError } from 'axios';
import { useContext, useLayoutEffect, useMemo, useState } from 'react';
import ResponseSurvey from '../public/ResponseSurvey';
import ExpiredAnswer from './ExpiredAnswer';
import LoginRequired from './LoginRequired';
import { SurveyStatus } from '@share/enums/survey-status';
import { LocalizationManager } from '@util/LocalizationManager';

export default function SurveyDetail({ survey }: { survey: GetSurveyDetailResponse }) {
  const { addNotice } = useContext(GlobalSnackbarContext);
  const [renderPageTag, setRenderPageTag] = useState<RenderPageTag | null>(null);
  const setUser = useAuthStore((state) => state.actions.setUser);
  const { mutate: validateFirstAnswerMutation } = useMutation({
    mutationKey: mutationKeys.survey.validateFirstAnswer(),
    mutationFn: () => validateFirstSurveyAnswer(survey.id as number),
    onSuccess: (data) => {
      if (data.ok) {
        if (data.payload?.isFirst) {
          setRenderPageTag(RenderPageTag.AnswerStart);
        } else {
          setRenderPageTag(RenderPageTag.AnswerContinue);
        }
      }
    },
    onError: (error: AxiosError<ServerResponse<void>>) => {
      if (error instanceof CanceledError) {
        return;
      }
      if (error.response?.status === 400) {
        switch (error.response?.data.name) {
          // 응답자 이전 소유자로 인한 예외 (이어서 갱신 필요)
          case 'LoginRequiredForAnswerExceptionDto':
            setRenderPageTag(RenderPageTag.Login);
            setUser(null);
            addNotice(error.response?.data.message, 'warning');
            break;
          case 'AnswerOwnerMigratedExceptionDto':
            setRenderPageTag(RenderPageTag.AnswerOwnerMigrated);
            addNotice(error.response?.data.message, 'warning');
            break;
          // jws 잘못된 토큰 (처음부터 시작)
          case 'NoVerifyAccessTokenExceptionDto':
            setRenderPageTag(RenderPageTag.NoVerifyAccessToken);
            addNotice(error.response?.data.message, 'error');
            break;
          // jws 토큰 없기 때문에 (이어서 갱신 필요)
          case 'RequiredRefreshJwsExceptionDto':
            setRenderPageTag(RenderPageTag.RequiredRefreshJws);
            addNotice(error.response?.data.message, 'error');
            break;
          // jws 토큰 만료로 갱신 필요 (이어서 갱신 필요)
          case 'ExpiredJwsExceptionDto':
            setRenderPageTag(RenderPageTag.ExpiredJws);
            addNotice(error.response?.data.message, 'error');
            break;
          // 응답 세션 만료 (SSOT) (처음부터 시작)
          case 'ExpiredAnswerExceptionDto':
            setRenderPageTag(RenderPageTag.ExpiredAnswer);
            addNotice(error.response?.data.message, 'error');
            break;
        }
      } else if (error.response?.status === 404) {
        if (error.response?.data.name === 'NotFoundSurveyExceptionDto') {
          setRenderPageTag(RenderPageTag.NotFoundSurvey);
          addNotice('존재하지 않는 설문입니다.', 'error');
        } else if (error.response?.data.name === 'NotFoundAnswerExceptionDto') {
          setRenderPageTag(RenderPageTag.NotFoundAnswer);
          addNotice('존재하지 않는 응답입니다.', 'error');
        }
      } else {
        addNotice(error?.response?.data?.message ?? '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
      }
    },
  });
  const { mutate: refreshJwsMutation } = useMutation({
    mutationKey: mutationKeys.auth.refreshJws(),
    mutationFn: () => refreshJws(survey.id as number),
    onSuccess: () => {
      validateFirstAnswerMutation();
    },
    onError: (error: AxiosError<ServerResponse<void>>) => {
      if (error instanceof CanceledError) {
        return;
      }
      if (error.response?.status === 404) {
        if (error.response?.data.name === 'NotFoundSurveyExceptionDto') {
          setRenderPageTag(RenderPageTag.NotFoundSurvey);
          addNotice('존재하지 않는 설문입니다.', 'error');
        } else if (error.response?.data.name === 'NotFoundAnswerExceptionDto') {
          setRenderPageTag(RenderPageTag.NotFoundAnswer);
          addNotice('존재하지 않는 응답입니다.', 'error');
        }
      } else {
        addNotice(error.response?.data?.message ?? '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
      }
    },
  });
  const { mutate: startAnswerMutation } = useMutation({
    mutationKey: mutationKeys.survey.startAnswer(),
    mutationFn: () => startAnswer({ surveyId: survey.id as number }),
    onSuccess: () => {
      validateFirstAnswerMutation();
    },
    onError: (error: AxiosError<ServerResponse<void>>) => {
      if (error instanceof CanceledError) {
        return;
      }
      if (error.response?.status === 400) {
        if (error.response?.data.name === 'AlreadyAnsweredExceptionDto') {
          addNotice(error.response?.data.message, 'error');
        }
      } else {
        addNotice(error.response?.data?.message ?? '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
      }
    },
  });

  useLayoutEffect(() => {
    validateFirstAnswerMutation();
  }, []);

  function handleStartAnswer() {
    if (renderPageTag === RenderPageTag.ExpiredAnswer) {
      refreshJwsMutation();
      return;
    } else {
      startAnswerMutation();
    }
  }

  const startButtonText = useMemo(() => {
    switch (renderPageTag) {
      case RenderPageTag.Login:
        return '로그인';
      case RenderPageTag.NoVerifyAccessToken:
      case RenderPageTag.ExpiredAnswer:
        return '참여하기';
      case RenderPageTag.AnswerOwnerMigrated:
      case RenderPageTag.RequiredRefreshJws:
      case RenderPageTag.ExpiredJws:
        return '이어서 참여하기';
      default:
        return '참여하기';
    }
  }, [renderPageTag]);

  const surveyDataWithAnswers = {
    ...survey,
    questionCount: survey.questions.length,
    respondentCount: survey.totalResponses,
    isOwner: survey.isOwner,
    questions: survey.questions.map((question, idx) => {
      const questionAnswers = survey.questionAnswers?.filter((answer) => answer.questionId === question.id);
      const questionAnswersMap = new Map();

      if (question.questionType === QuestionType.MultipleChoice) {
        questionAnswers?.forEach((answer) => {
          questionAnswersMap.set(answer.questionOptionId, {
            optionId: answer.questionOptionId,
            value: null,
          });
        });
      } else if (question.questionType === QuestionType.SingleChoice) {
        if (questionAnswers[0]?.questionOptionId) {
          questionAnswersMap.set(1, {
            optionId: questionAnswers[0].questionOptionId,
            value: null,
          });
        }
      } else {
        questionAnswers?.forEach((answer) => {
          if ((answer.value && answer.value !== 'undefined') || answer.referenceBuffer) {
            questionAnswersMap.set(1, {
              optionId: null,
              value: answer.value,
              referenceBuffer: answer.referenceBuffer,
            });
          }
        });
      }

      return {
        ...question,
        idx: Date.now() + idx,
        questionOptions: question.questionOptions?.map((option, idx) => ({ ...option, idx: Date.now() + idx })),
        questionAnswers: questionAnswersMap,
        isAnswered: false,
      };
    }),
  };

  if (renderPageTag === RenderPageTag.NotFoundSurvey) {
    return <NotFound title="설문을 찾을 수 없습니다" reload />;
  }

  if (renderPageTag === RenderPageTag.NotFoundAnswer) {
    return <NotFound title="응답을 찾을 수 없습니다" reload />;
  }

  if (renderPageTag === RenderPageTag.ExpiredAnswer) {
    return <ExpiredAnswer survey={survey} />;
  }

  if (renderPageTag === RenderPageTag.Login) {
    return <LoginRequired surveyTitle={survey.title} />;
  }

  if (renderPageTag === null) {
    return null;
  }

  if (renderPageTag !== RenderPageTag.AnswerContinue) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <OutlineBox sx={{ textAlign: 'center', p: { xs: 6, md: 8 } }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            {survey.title}
          </Typography>

          <Typography variant="h6" sx={{ mb: 6, color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
            {survey.description}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} gap={3} sx={{ mb: 6, justifyContent: 'center' }}>
            <Chip icon={<QuestionMark />} label={`총 ${survey.questions.length}개 문항`} variant="outlined" color="primary" />
            <Chip icon={<Timer />} label={`약 ${survey.estimatedTime}분 소요`} variant="outlined" color="secondary" />
          </Stack>

          {survey.status !== SurveyStatus.Active ? (
            <Alert severity="warning">
              <Typography variant="body2">
                현재 설문 상태가 <b>{LocalizationManager.translate(survey.status)}</b> 상태입니다.
              </Typography>
            </Alert>
          ) : (
            <ActionButton size="large" variant="contained" shape="rounded" endIcon={<PlayArrow />} onClick={handleStartAnswer}>
              {startButtonText}
            </ActionButton>
          )}
          <Typography variant="caption" sx={{ mt: 4, color: 'text.disabled', display: 'block' }}>
            모든 응답은 익명으로 처리되며 안전하게 보호됩니다
          </Typography>
        </OutlineBox>
      </Container>
    );
  }

  return <ResponseSurvey survey={surveyDataWithAnswers} refreshJwsMutation={refreshJwsMutation} />;
}
