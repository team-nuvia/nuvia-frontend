'use client';

import LoadingContext from '@context/LodingContext';
import { ArrowBack, ArrowForward, CheckCircle, Person, PhotoCamera, Schedule, Send, ThumbUp } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Fade,
  FormControl,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  Radio,
  RadioGroup,
  Rating,
  Slider,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

interface Question {
  id: string;
  type: 'text' | 'choice' | 'multiple' | 'rating' | 'slider' | 'image' | 'email' | 'phone';
  title: string;
  description?: string;
  options?: string[];
  required: boolean;
  min?: number;
  max?: number;
  step?: number;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar?: string;
  };
  estimatedTime: number;
  totalResponses: number;
  questions: Question[];
  settings: {
    allowAnonymous: boolean;
    showProgress: boolean;
    randomizeQuestions: boolean;
    oneResponsePerUser: boolean;
  };
}

// Mock survey data with more variety
const mockSurvey: Survey = {
  id: '1',
  title: '2024 고객 만족도 및 서비스 개선 설문조사',
  description:
    '안녕하세요! 저희 서비스를 이용해주셔서 감사합니다. 더 나은 서비스 제공을 위해 고객님의 소중한 의견을 듣고자 합니다. 설문은 약 5분 정도 소요되며, 모든 응답은 익명으로 처리됩니다.',
  author: {
    name: 'Nuvia Team',
    avatar: 'N',
  },
  estimatedTime: 5,
  totalResponses: 1247,
  settings: {
    allowAnonymous: true,
    showProgress: true,
    randomizeQuestions: false,
    oneResponsePerUser: false,
  },
  questions: [
    {
      id: '1',
      type: 'choice',
      title: '저희 서비스를 어떻게 알게 되셨나요?',
      description: '가장 주된 경로를 선택해주세요',
      options: ['검색엔진 (구글, 네이버 등)', '소셜미디어 (인스타그램, 페이스북 등)', '지인 추천', '온라인 광고', '블로그/리뷰', '기타'],
      required: true,
    },
    {
      id: '2',
      type: 'rating',
      title: '전반적인 서비스 만족도를 평가해주세요',
      description: '1점(매우 불만족) ~ 5점(매우 만족)',
      required: true,
    },
    {
      id: '3',
      type: 'multiple',
      title: '어떤 기능들을 주로 사용하시나요? (복수 선택 가능)',
      options: ['설문 생성', '응답 수집', '통계 분석', '데이터 내보내기', '팀 협업', '템플릿 사용'],
      required: false,
    },
    {
      id: '4',
      type: 'slider',
      title: '저희 서비스를 다른 사람에게 추천할 가능성은 얼마나 되나요?',
      description: '0점(전혀 추천하지 않음) ~ 10점(적극 추천)',
      min: 0,
      max: 10,
      step: 1,
      required: true,
    },
    {
      id: '5',
      type: 'text',
      title: '개선이 필요한 부분이나 추가하고 싶은 기능이 있다면 자유롭게 작성해주세요',
      description: '구체적인 의견일수록 서비스 개선에 큰 도움이 됩니다',
      required: false,
    },
    {
      id: '6',
      type: 'email',
      title: '추후 서비스 업데이트 소식을 받고 싶으시다면 이메일을 입력해주세요',
      description: '선택사항이며, 마케팅 목적으로만 사용됩니다',
      required: false,
    },
  ],
};
export default function SurveyDetail() {
  const params = useParams() ?? { id: 1 };
  const { id = 1 } = params;
  const theme = useTheme();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startTime] = useState(Date.now());
  const { loading, endLoading } = useContext(LoadingContext);

  // Load survey data
  useEffect(() => {
    const loadSurvey = async () => {
      setSurvey(mockSurvey);
      endLoading();
    };

    loadSurvey();
  }, [params.id]);

  const currentQuestion = survey?.questions[currentStep];
  const isLastQuestion = currentStep === (survey?.questions.length || 0) - 1;
  const progress = survey ? ((currentStep + 1) / survey.questions.length) * 100 : 0;

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
    // Clear error when user provides answer
    if (errors[questionId]) {
      setErrors({ ...errors, [questionId]: '' });
    }
  };

  const validateCurrentQuestion = () => {
    if (!currentQuestion) return true;

    const answer = answers[currentQuestion.id];
    const newErrors = { ...errors };

    if (currentQuestion.required) {
      if (answer === undefined || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
        newErrors[currentQuestion.id] = '이 질문은 필수입니다';
        setErrors(newErrors);
        return false;
      }
    }

    if (currentQuestion.type === 'email' && answer) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(answer)) {
        newErrors[currentQuestion.id] = '올바른 이메일 형식을 입력해주세요';
        setErrors(newErrors);
        return false;
      }
    }

    if (currentQuestion.type === 'phone' && answer) {
      const phoneRegex = /^[0-9-+\s()]+$/;
      if (!phoneRegex.test(answer)) {
        newErrors[currentQuestion.id] = '올바른 전화번호 형식을 입력해주세요';
        setErrors(newErrors);
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentQuestion()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleSubmit = async () => {
    if (!validateCurrentQuestion()) return;

    setIsSubmitting(true);

    try {
      const responseTime = Date.now() - startTime;
      const submissionData = {
        surveyId: params.id,
        answers,
        responseTime,
        timestamp: new Date().toISOString(),
      };

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Survey submitted:', submissionData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const answer = answers[question.id];
    const hasError = !!errors[question.id];

    switch (question.type) {
      case 'choice':
        return (
          <FormControl component="fieldset" fullWidth error={hasError}>
            <RadioGroup value={answer || ''} onChange={(e) => handleAnswerChange(question.id, e.target.value)}>
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{
                    mb: 1,
                    p: 2,
                    border: '1px solid',
                    borderColor: answer === option ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'multiple':
        return (
          <FormControl component="fieldset" fullWidth error={hasError}>
            <FormGroup>
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={(answer || []).includes(option)}
                      onChange={(e) => {
                        const currentAnswers = answer || [];
                        const newAnswers = e.target.checked ? [...currentAnswers, option] : currentAnswers.filter((a: string) => a !== option);
                        handleAnswerChange(question.id, newAnswers);
                      }}
                    />
                  }
                  label={option}
                  sx={{
                    mb: 1,
                    p: 2,
                    border: '1px solid',
                    borderColor: (answer || []).includes(option) ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                />
              ))}
            </FormGroup>
          </FormControl>
        );

      case 'rating':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Rating
              size="large"
              value={answer || 0}
              onChange={(_, value) => handleAnswerChange(question.id, value)}
              sx={{ fontSize: '3rem', mb: 2 }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                maxWidth: 300,
                mx: 'auto',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                매우 불만족
              </Typography>
              <Typography variant="caption" color="text.secondary">
                매우 만족
              </Typography>
            </Box>
          </Box>
        );

      case 'slider':
        return (
          <Box sx={{ px: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {answer || question.min || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                점
              </Typography>
            </Box>
            <Slider
              value={answer || question.min || 0}
              onChange={(_, value) => handleAnswerChange(question.id, value)}
              min={question.min || 0}
              max={question.max || 10}
              step={question.step || 1}
              marks
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                {question.min || 0}점
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {question.max || 10}점
              </Typography>
            </Box>
          </Box>
        );

      case 'text':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            value={answer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="의견을 자유롭게 작성해주세요..."
            error={hasError}
            helperText={errors[question.id]}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        );

      case 'email':
        return (
          <TextField
            fullWidth
            type="email"
            value={answer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="example@email.com"
            error={hasError}
            helperText={errors[question.id]}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        );

      case 'phone':
        return (
          <TextField
            fullWidth
            type="tel"
            value={answer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="010-1234-5678"
            error={hasError}
            helperText={errors[question.id]}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        );

      case 'image':
        return (
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
              },
            }}
          >
            <PhotoCamera sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              이미지를 업로드하려면 클릭하세요
            </Typography>
            <Typography variant="caption" color="text.secondary">
              JPG, PNG 파일만 지원 (최대 5MB)
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!survey) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ textAlign: 'center' }}>
          설문을 찾을 수 없습니다. URL을 확인해주세요.
        </Alert>
      </Container>
    );
  }

  if (isSubmitted) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Card
            sx={{
              textAlign: 'center',
              p: 6,
              background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
            }}
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
              <CheckCircle sx={{ fontSize: 100, color: 'success.main', mb: 3 }} />
            </motion.div>

            <Typography variant="h3" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
              응답이 완료되었습니다!
            </Typography>

            <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)' }}>
              소중한 의견을 주셔서 감사합니다
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
              <Chip
                icon={<Person />}
                label={`총 ${survey.totalResponses + 1}명 참여`}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                }}
              />
              <Chip
                icon={<ThumbUp />}
                label="피드백 반영 예정"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                }}
              />
            </Box>

            <Button
              variant="contained"
              href="/"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
              }}
            >
              홈으로 돌아가기
            </Button>
          </Card>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 설문 헤더 */}
      <Card sx={{ mb: 4, overflow: 'visible' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>{survey.author.avatar}</Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {survey.author.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                <Chip icon={<Schedule />} label={`약 ${survey.estimatedTime}분`} size="small" />
                <Chip icon={<Person />} label={`${survey.totalResponses}명 참여`} size="small" />
              </Box>
            </Box>
          </Box>

          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            {survey.title}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {survey.description}
          </Typography>
        </CardContent>
      </Card>

      {/* 진행률 */}
      {survey.settings.showProgress && (
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                진행률
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentStep + 1} / {survey.questions.length}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'action.hover',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                },
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* 질문 카드 */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 600, flexGrow: 1 }}>
                      {currentStep + 1}. {currentQuestion.title}
                    </Typography>
                    {currentQuestion.required && <Chip label="필수" size="small" color="primary" />}
                  </Box>

                  {currentQuestion.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {currentQuestion.description}
                    </Typography>
                  )}
                </Box>

                {renderQuestion(currentQuestion)}

                {errors[currentQuestion.id] && (
                  <Fade in>
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {errors[currentQuestion.id]}
                    </Alert>
                  </Fade>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

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
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
            onClick={handleSubmit}
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

      {/* 하단 정보 */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="caption" color="text.secondary">
          이 설문은 Nuvia로 제작되었습니다 • 모든 응답은 안전하게 보호됩니다
        </Typography>
      </Box>
    </Container>
  );
}
