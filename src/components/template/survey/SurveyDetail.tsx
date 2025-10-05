'use client';

import NotFound from '@/app/(survey-view)/survey/view/[hash]/not-found';
import { GetSurveyDetailResponse } from '@/models/GetSurveyDetailResponse';
import mutationKeys from '@/store/lib/mutation-key';
import { refreshJws } from '@api/auth/refresh-jws';
import { startAnswer } from '@api/survey/start-answer';
import { validateFirstSurveyAnswer } from '@api/survey/validate-first-answer';
import ActionButton from '@components/atom/ActionButton';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import LoadingContext from '@context/LoadingContext';
import { PlayArrow, QuestionMark, Timer } from '@mui/icons-material';
import { Box, Card, Chip, Container, Typography, useTheme } from '@mui/material';
import { QuestionType } from '@share/enums/question-type';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, CanceledError } from 'axios';
import { motion } from 'framer-motion';
import { useContext, useLayoutEffect, useMemo, useState } from 'react';
import ResponseSurvey from '../public/ResponseSurvey';
import ExpiredAnswer from './ExpiredAnswer';

export default function SurveyDetail({ survey }: { survey: GetSurveyDetailResponse }) {
  const theme = useTheme();
  const { addNotice } = useContext(GlobalSnackbarContext);
  const { endLoading, startLoading } = useContext(LoadingContext);
  const [isFirstAnswer, setIsFirstAnswer] = useState<boolean | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [requireRefreshJws, setRequireRefreshJws] = useState(false);
  const { mutate: validateFirstAnswerMutation, error: validateFirstAnswerError } = useMutation({
    mutationKey: mutationKeys.survey.validateFirstAnswer(),
    mutationFn: () => validateFirstSurveyAnswer(survey.id as number),
    onSuccess: (data) => {
      if (data.ok) {
        setRequireRefreshJws(false);
        setIsFirstAnswer(data.payload?.isFirst ?? false);
        setIsExpired(false);
        endLoading();
      }
    },
    onError: (error: AxiosError<ServerResponse<void>>) => {
      if (error instanceof CanceledError) {
        return;
      }
      if (error.response?.status === 400) {
        switch (error.response?.data.name) {
          // jws 잘못된 토큰 (처음부터 시작)
          case 'NoVerifyAccessTokenExceptionDto':
            setIsExpired(false);
            setIsFirstAnswer(true);
            break;
          // jws 토큰 없기 때문에 (이어서 갱신 필요)
          case 'RequiredRefreshJwsExceptionDto':
            setIsExpired(false);
            setIsFirstAnswer(false);
            setRequireRefreshJws(true);
            break;
          // jws 토큰 만료로 갱신 필요 (이어서 갱신 필요)
          case 'ExpiredJwsExceptionDto':
            setIsExpired(true);
            setIsFirstAnswer(false);
            setRequireRefreshJws(true);
            break;
          // 응답 세션 만료 (SSOT) (처음부터 시작)
          case 'ExpiredAnswerExceptionDto':
            setIsExpired(true);
            setIsFirstAnswer(false);
            setRequireRefreshJws(false);
            break;
        }
        addNotice(error.response?.data.message, 'error');
        endLoading();
      } else if (error.response?.status === 404) {
        addNotice('존재하지 않는 설문입니다.', 'error');
      } else {
        addNotice(error?.response?.data?.message ?? '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
      }
    },
  });
  const { mutate: refreshJwsMutation, error: refreshJwsError } = useMutation({
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
        addNotice('존재하지 않는 설문입니다.', 'error');
      } else {
        addNotice(error.response?.data?.message ?? '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
        endLoading();
      }
    },
  });
  const { mutate: startAnswerMutation } = useMutation<ServerResponse<null>>({
    mutationKey: mutationKeys.survey.startAnswer(),
    mutationFn: () => startAnswer({ surveyId: survey.id as number }),
    onSuccess: () => {
      validateFirstAnswerMutation();
    },
  });

  useLayoutEffect(() => {
    validateFirstAnswerMutation();
  }, []);

  function handleStartAnswer() {
    if (requireRefreshJws) {
      refreshJwsMutation();
      return;
    } else {
      startLoading();
      startAnswerMutation();
    }
  }

  const startButtonText = useMemo(() => {
    if (isFirstAnswer && isExpired) {
      return '다시 참여하기';
    } else if (isFirstAnswer && !isExpired) {
      return '참여하기';
    } else if (!isFirstAnswer && isExpired) {
      return '이어서 참여하기';
    } else if (!isFirstAnswer && !isExpired) {
      return '이어서 참여하기';
    }
    return '참여하기';
  }, [isFirstAnswer, isExpired]);

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

  if (refreshJwsError?.response?.status === 404 || validateFirstAnswerError?.response?.status === 404) {
    return <NotFound />;
  }

  if (validateFirstAnswerError?.response?.status === 400 && !requireRefreshJws) {
    return <ExpiredAnswer survey={survey} />;
  }

  if (isFirstAnswer === null) {
    return null;
  }

  if (isFirstAnswer || isExpired || requireRefreshJws) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
          <Card
            sx={{
              textAlign: 'center',
              p: { xs: 4, md: 8 },
              background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <Typography
                variant="h3"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  color: 'white',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                {survey.title}
              </Typography>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                {survey.description}
              </Typography>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'center',
                  gap: { xs: 2, sm: 3 },
                  mb: 6,
                  alignItems: 'center',
                }}
              >
                <Chip
                  icon={<QuestionMark />}
                  label={`총 ${survey.questions.length}개 문항`}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    height: 40,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    '& .MuiChip-icon': {
                      color: 'white',
                    },
                  }}
                />
                <Chip
                  icon={<Timer />}
                  label="약 5분 소요"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    height: 40,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    '& .MuiChip-icon': {
                      color: 'white',
                    },
                  }}
                />
              </Box>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
              <ActionButton size="xlarge" variant="contained" shape="rounded" endIcon={<PlayArrow />} onClick={handleStartAnswer}>
                {startButtonText}
              </ActionButton>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }}>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{
                  mt: 4,
                  fontSize: '0.85rem',
                }}
              >
                모든 응답은 익명으로 처리되며 안전하게 보호됩니다
              </Typography>
            </motion.div>
          </Card>
        </motion.div>
      </Container>
    );
  }

  return <ResponseSurvey survey={surveyDataWithAnswers} refreshJwsMutation={refreshJwsMutation} />;
}
