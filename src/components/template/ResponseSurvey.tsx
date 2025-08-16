import { AnswerPayload } from '@/models/AnswerPayload';
import { PreviewPayload } from '@/models/PreviewPayload';
import { createAnswer } from '@api/create-answer';
import ActionButton from '@components/atom/ActionButton';
import CommonText from '@components/atom/CommonText';
import SurveyProgress from '@components/molecular/SurveyProgress';
import UserDescription from '@components/molecular/UserDescription';
import ResponseCard from '@components/organism/ResponseCard';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import { ArrowBack, ArrowForward, Category, CheckCircle, Person, ThumbUp } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Fade,
  Grid,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TimeIcon } from '@mui/x-date-pickers/icons';
import { QuestionType } from '@share/enums/question-type';
import { useMutation } from '@tanstack/react-query';
import { DateFormat } from '@util/dateFormat';
import { isEmpty } from '@util/isEmpty';
import { isNil } from '@util/isNil';
import { AxiosError } from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useMemo, useState } from 'react';

interface ResponseSurveyProps {
  survey: PreviewPayload;
}
// --- COMPONENT ---
const ResponseSurvey: React.FC<ResponseSurveyProps> = ({ survey }) => {
  // --- STATE ---
  const router = useRouter();
  const [questions, setQuestions] = useState<PreviewPayload['questions']>(survey.questions);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addNotice } = useContext(GlobalSnackbarContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [direction, setDirection] = useState<'next' | 'previous'>('next');
  const getQuestionProcess = () => {
    const totalQuestions = questions.length;
    const answeredQuestions = questions.filter((question) => {
      const values = Array.from(question.answers?.values?.() ?? []);
      return question.isAnswered || (values.some((item) => !isEmpty(item)) && question.answers?.size > 0);
    }).length;
    return Math.round((answeredQuestions / totalQuestions) * 100) || 0;
  };
  const { mutate: createAnswerMutate } = useMutation({
    mutationFn: ({ surveyId, answerData }: { surveyId: number; answerData: AnswerPayload }) => createAnswer(surveyId, answerData),
    onSuccess: (response) => {
      console.log('🚀 ~ ResponseSurvey ~ response:', response);
      if (response.httpStatus === 201) {
        addNotice(response.message, 'success');
        // Reset form
        setIsSubmitted(true);
        setQuestions([]);
      } else {
        addNotice(`오류: ${response.statusText}`, 'error');
      }
      setIsSubmitting(false);
    },
    onError: (error: AxiosError<ServerResponse<void>>) => {
      console.log('🚀 ~ ResponseSurvey ~ error:', error);
      addNotice(error?.response?.data?.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
      setIsSubmitting(false);
    },
  });

  const isAllAnswered = useMemo(() => {
    return getQuestionProcess() === 100;
  }, [questions]);

  useEffect(() => {
    setProgress(getQuestionProcess());
  }, [questions, currentStep]);

  function handleOptionChange<T extends string>(questionIdx: number, optionIdx: number | null, value: T | null) {
    setErrors((errors) => {
      const newErrors = { ...errors };
      delete newErrors[questionIdx];
      return newErrors;
    });
    setQuestions((questions) => {
      return questions.map((q) => {
        if (q.idx === questionIdx) {
          if (q.questionType === QuestionType.SingleChoice) {
            q.answers?.clear();
            q.answers?.set(1, {
              optionId: optionIdx,
              value: null,
            });
          } else if (q.questionType === QuestionType.MultipleChoice) {
            if (optionIdx === null) {
              q.answers?.clear();
            } else {
              if (!value) {
                q.answers?.delete(optionIdx as number);
              } else {
                q.answers?.set(optionIdx as number, {
                  optionId: optionIdx,
                  value: null,
                });
              }
            }
          } else {
            if (value) {
              q.answers?.set(1, {
                optionId: null,
                value: value,
              });
            } else {
              q.answers?.delete(1);
            }
          }
        }
        return { ...q };
      });
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAllAnswered) {
      for (const q of questions) {
        if (q.isRequired && !q.isAnswered) {
          setErrors((errors) => {
            const newErrors = { ...errors };
            newErrors[q.idx] = '이 질문은 필수입니다';
            return newErrors;
          });
        }
      }
      return false;
    }

    setIsSubmitting(true);
    // setError(null);
    // setSuccess(null);

    const answerData: AnswerPayload = {
      answers: questions.map(({ idx, ...rest }) => {
        if (rest.questionType === QuestionType.MultipleChoice || rest.questionType === QuestionType.SingleChoice) {
          const values = rest.answers.values();
          const optionIds = Array.from(values)
            .map(({ optionId }) => optionId)
            .filter((optionId) => !isNil(optionId));
          return {
            questionId: rest.id ?? 0,
            optionIds,
            value: null,
          };
        }
        const values = rest.answers.values();
        const value = Array.from(values)
          .map(({ value }) => value)
          .filter((value) => !isNil(value) && value);
        return {
          questionId: rest.id ?? 0,
          optionIds: null, // Remove client-side IDs
          value: '' + value[0],
        };
      }),
    };

    createAnswerMutate({ surveyId: survey.id ?? 0, answerData });
  };

  const validateCurrentQuestion = () => {
    if (!currentQuestion) return true;

    const answers = questions[currentStep].answers;
    const isAnswered = answers?.values().some((item) => !isEmpty(item));
    const newErrors = { ...errors };

    if (currentQuestion.isRequired) {
      if (!isAnswered || answers?.size === 0) {
        newErrors[currentQuestion.idx] = '이 질문은 필수입니다';
        setErrors(newErrors);
        return false;
      }
    }

    for (const answer of answers?.values() || []) {
      if (currentQuestion.dataType === 'email' && isAnswered) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(answer.value as string)) {
          newErrors[currentQuestion.idx] = '올바른 이메일 형식을 입력해주세요';
          setErrors(newErrors);
          return false;
        }
      }
    }

    setErrors(newErrors);
    return true;
    // if (currentQuestion.dataType === 'email' && isAnswered) {
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   if (!emailRegex.test(answer)) {
    //     newErrors[currentQuestion.id] = '올바른 이메일 형식을 입력해주세요';
    //     setErrors(newErrors);
    //     return false;
    //   }
    // }
  };

  const handleNext = () => {
    if (validateCurrentQuestion()) {
      questions[currentStep].isAnswered = true;
      setQuestions(questions);
      setDirection('next');
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 50);
    }
  };

  const handlePrevious = () => {
    setDirection('previous');
    setTimeout(() => {
      setCurrentStep((prev) => Math.max(0, prev - 1));
      if (!questions[currentStep - 1].isRequired) {
        if (questions[currentStep - 1].answers?.values().some((item) => isEmpty(item)) || questions[currentStep - 1].answers?.size === 0) {
          questions[currentStep - 1].isAnswered = false;
          setQuestions(questions);
        }
      }
    }, 50);
  };

  const currentQuestion = useMemo(() => {
    return questions[currentStep];
  }, [questions, currentStep]);
  const isLastQuestion = currentStep === questions.length - 1;

  if (isSubmitted) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -50 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Card
            sx={{
              textAlign: 'center',
              p: { xs: 4, md: 8 },
              background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 150, damping: 10 }}
            >
              <CheckCircle color="success" sx={{ fontSize: 80, color: 'white', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
              <Typography
                variant="h3"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: 'white',
                  fontSize: { xs: '2rem', md: '3rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                응답이 완료되었습니다!
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mb: 5,
                  color: 'rgba(255,255,255,0.95)',
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  fontWeight: 400,
                  letterSpacing: '0.5px',
                }}
              >
                소중한 의견을 주셔서 감사합니다
              </Typography>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }}>
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
                  icon={<Person />}
                  label={`총 ${survey.totalResponses + 1}명 참여`}
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
                  icon={<ThumbUp />}
                  label="피드백 반영 예정"
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

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }}>
              <ActionButton size="large" variant="contained" shape="rounded" endIcon={<ArrowForward />} onClick={() => router.push('/')}>
                홈으로 돌아가기
              </ActionButton>
            </motion.div>
          </Card>
        </motion.div>
      </Container>
    );
  }

  // --- RENDER ---
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid component="form" noValidate autoComplete="off" onSubmit={handleSubmit} container spacing={2} mt={5}>
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 4,
            }}
          >
            <UserDescription
              name={survey.author.name ?? 'John Doe'}
              content={
                <Stack direction="row" alignItems="center" gap={1}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Chip size="small" icon={<Category />} label={survey.category.name} />
                    {survey.expiresAt ? (
                      <Chip size="small" icon={<TimeIcon />} label={`${DateFormat.toKST('YYYY-MM-dd HH:mm', survey.expiresAt)} 까지`} />
                    ) : (
                      <Chip size="small" icon={<TimeIcon />} label="만료 없음" />
                    )}
                    <Chip size="small" icon={<TimeIcon />} label={`${survey.estimatedTime}분 소요`} />
                  </Stack>
                </Stack>
              }
            />
            <CommonText variant="h4" thickness="bold" mb={2}>
              {survey.title}
            </CommonText>
            <CommonText variant="h6" color="textSecondary" thickness="regular" mb={2} mt={2}>
              {survey.description}
            </CommonText>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          {/* 본인 설문 상세 조회 시 활성화 */}
          {/* <Chip label={survey.isPublic ? '공개' : '비공개'} /> */}
          <Paper sx={{ p: 4 }}>
            <SurveyProgress progress={progress} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          {/* 질문 카드 */}
          <AnimatePresence mode="wait" initial={false}>
            {currentQuestion && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: direction === 'next' ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === 'next' ? -100 : 100 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{ mb: 4 }}>
                  <CardContent sx={{ p: 4 }}>
                    <ResponseCard
                      key={currentQuestion.id || 'idx' + currentQuestion.idx}
                      id={currentQuestion.id}
                      idx={currentQuestion.idx}
                      index={currentStep + 1}
                      title={currentQuestion.title}
                      description={currentQuestion.description}
                      questionType={currentQuestion.questionType}
                      dataType={currentQuestion.dataType}
                      isRequired={currentQuestion.isRequired}
                      questionOptions={currentQuestion.questionOptions}
                      answers={currentQuestion.answers}
                      handleOptionChange={handleOptionChange}
                    />
                    {/* {errors[currentQuestion.idx] && (
                    <CommonText color="error" variant="body2" px={4} pb={4}>
                      {errors[currentQuestion.idx]}
                    </CommonText>
                  )} */}
                    {errors[currentQuestion.idx] && (
                      <Fade in>
                        <Alert severity="error" sx={{ mt: 2 }}>
                          {errors[currentQuestion.idx]}
                        </Alert>
                      </Fade>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>

        <Grid size={{ xs: 12 }}>
          {/* 네비게이션 버튼 */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={handlePrevious} disabled={currentStep === 0} sx={{ minWidth: 120 }}>
              이전
            </Button>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {survey.questions.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: index <= currentStep ? 'primary.main' : 'action.disabled',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </Box>

            {isLastQuestion ? (
              <Button
                variant="contained"
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                type="submit"
                disabled={isSubmitting || !isAllAnswered}
                sx={{ minWidth: 120 }}
              >
                {isSubmitting ? '제출 중...' : '제출하기'}
              </Button>
            ) : (
              <Button variant="contained" endIcon={<ArrowForward />} onClick={handleNext} sx={{ minWidth: 120 }}>
                다음
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
      {/* 하단 정보 */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="caption" color="text.secondary">
          이 설문은 Nuvia로 제작되었습니다 • 모든 응답은 안전하게 보호됩니다
        </Typography>
      </Box>
    </Container>
  );
};

export default ResponseSurvey;
