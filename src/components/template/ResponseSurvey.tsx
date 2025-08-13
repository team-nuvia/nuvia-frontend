import CommonText from '@components/atom/CommonText';
import SurveyProgress from '@components/molecular/SurveyProgress';
import UserDescription from '@components/molecular/UserDescription';
import ResponseCard from '@components/organism/ResponseCard';
import { ArrowBack, ArrowForward, Category, People } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import { Alert, Box, Button, Chip, CircularProgress, Container, Grid, Paper, Snackbar, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TimeIcon } from '@mui/x-date-pickers/icons';
import { IResponseSurveyCategory } from '@share/dto/response-survey';
import { QuestionType } from '@share/enums/question-type';
import { AllQuestion } from '@share/interface/iquestion';
import { DateFormat } from '@util/dateFormat';
import { isEmpty } from '@util/isEmpty';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

interface ResponseSurveyProps {
  survey: IResponseSurveyCategory;
}
// --- COMPONENT ---
const ResponseSurvey: React.FC<ResponseSurveyProps> = ({ survey }) => {
  // --- STATE ---
  const [questions, setQuestions] = useState<AllQuestion[]>(survey.questions);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [direction, setDirection] = useState<'next' | 'previous'>('next');

  useEffect(() => {
    const totalQuestions = questions.length;
    const answeredQuestions = questions.filter(
      (question) => question.isAnswered || (question.answers?.values().some((item) => !isEmpty(item)) && question.answers?.size > 0),
    ).length;
    setProgress(Math.round((answeredQuestions / totalQuestions) * 100) || 0);
  }, [questions, currentStep]);

  function handleOptionChange<T extends string>(questionId: number, optionId: number, value: T) {
    setErrors((errors) => {
      const newErrors = { ...errors };
      delete newErrors[questionId];
      return newErrors;
    });
    setQuestions((questions) =>
      questions.map((q) => {
        if (q.id === questionId) {
          if (q.questionType === QuestionType.SingleChoice) {
            q.answers.clear();
            q.answers.set(optionId, value);
          } else {
            if (isEmpty(value) || value.length === 0) {
              q.answers.delete(optionId);
            } else {
              q.answers.set(optionId, value);
            }
          }
          q.answers = new Map(q.answers);
        }
        return q;
      }),
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('🚀 ~ handleSubmit ~ questions:', questions);
    const isAllAnswered = questions.every(
      (item) => item.isAnswered || (item.answers.size > 0 && item.answers.values().some((item) => !isEmpty(item))),
    );
    if (!isAllAnswered) {
      for (const q of questions) {
        if (q.isRequired && !q.isAnswered) {
          setErrors((errors) => {
            const newErrors = { ...errors };
            newErrors[q.id] = '이 질문은 필수입니다';
            return newErrors;
          });
        }
      }
      return false;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const surveyData = {
      category: survey.category,
      title: survey.title,
      description: survey.description,
      expires_at: survey.expiresAt,
      isPublic: survey.isPublic,
      questions: questions.map(({ id, ...rest }) => ({
        ...rest,
        questionOptions: (rest.questionOptions || []).map(({ id, ...optRest }) => optRest), // Remove client-side IDs
      })),
    };

    try {
      // Using a placeholder API endpoint
      const response = await axios.post('/api/nuvia/surveys', surveyData);

      if (response.status === 201) {
        let successMessage = '설문이 성공적으로 생성되었습니다!';
        setSuccess(successMessage);
        // Reset form
        setQuestions([]);
      } else {
        setError(`오류: ${response.statusText}`);
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateCurrentQuestion = () => {
    if (!currentQuestion) return true;

    const answers = questions[currentStep].answers;
    const isAnswered = answers.values().some((item) => !isEmpty(item));
    const newErrors = { ...errors };

    if (currentQuestion.isRequired) {
      if (!isAnswered || answers.size === 0) {
        newErrors[currentQuestion.id] = '이 질문은 필수입니다';
        setErrors(newErrors);
        return false;
      }
    }

    for (const answer of answers.values()) {
      if (currentQuestion.dataType === 'email' && isAnswered) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(answer)) {
          newErrors[currentQuestion.id] = '올바른 이메일 형식을 입력해주세요';
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
        if (questions[currentStep - 1].answers.values().some((item) => isEmpty(item)) || questions[currentStep - 1].answers.size === 0) {
          questions[currentStep - 1].isAnswered = false;
          setQuestions(questions);
        }
      }
    }, 50);
  };

  const currentQuestion = useMemo(() => {
    return questions[currentStep];
  }, [questions, currentStep]);
  // console.log('🚀 ~ currentQuestion ~ currentQuestion:', currentQuestion);
  const isLastQuestion = currentStep === questions.length - 1;

  /* 질문당 40초 */
  const estimatedTime = `${questions.length * 40}초`;

  // --- RENDER ---
  return (
    <Container maxWidth="lg">
      <Grid component="form" noValidate autoComplete="off" onSubmit={handleSubmit} container spacing={2} mt={5}>
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 4,
            }}
          >
            <UserDescription
              name={survey.name ?? 'John Doe'}
              content={
                <Stack direction="row" alignItems="center" gap={1}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Chip size="small" icon={<Category />} label={survey.category} />
                    <Chip size="small" icon={<TimeIcon />} label={DateFormat.toKST('YYYY-MM-DD HH:mm', survey.expiresAt || new Date())} />
                    <Chip size="small" icon={<TimeIcon />} label={estimatedTime} />
                    <Chip size="small" icon={<People />} label={`${survey.participants}명`} />
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
                <Paper>
                  <ResponseCard
                    key={currentQuestion.id}
                    id={currentQuestion.id}
                    index={currentStep + 1}
                    title={currentQuestion.title}
                    description={currentQuestion.description}
                    questionType={currentQuestion.questionType}
                    dataType={currentQuestion.dataType}
                    isRequired={currentQuestion.isRequired}
                    questionOptions={currentQuestion.questionOptions}
                    answers={currentQuestion.answers}
                    handleOptionChange={handleOptionChange}
                    // handleOptionClear={handleOptionClear}
                  />
                  {errors[currentQuestion.id] && (
                    <CommonText color="error" variant="body2" px={4} pb={4}>
                      {errors[currentQuestion.id]}
                    </CommonText>
                  )}
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>

        {/* <Grid size={{ xs: 12 }}>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              color="primary"
              onClick={handleSubmit}
              disabled={progress !== 100 || isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : '설문 저장'}
            </Button>
          </Box>
        </Grid> */}

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
                disabled={isSubmitting}
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

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ResponseSurvey;
