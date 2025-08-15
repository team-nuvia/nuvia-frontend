'use client';

import { getSurveyDetailView } from '@api/get-survey-detail-view';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import LoadingContext from '@context/LodingContext';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useContext, useLayoutEffect } from 'react';
import ResponseSurvey from './ResponseSurvey';

interface Question {
  id: string;
  questionType: QuestionType;
  dataType: DataType;
  title: string;
  description?: string;
  questionOptions?: { id: string; label: string }[];
  isRequired: boolean;
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

// export default function SurveyDetail({ hash }: { hash?: string }) {
//   const { addNotice } = useContext(GlobalSnackbarContext);
//   const theme = useTheme();
//   const router = useRouter();
//   // const [survey, setSurvey] = useState<GetSurveyDetailResponse | null>(null);
//   const [direction, setDirection] = useState<'next' | 'previous'>('next');
//   const [currentStep, setCurrentStep] = useState(0);
//   const [answers, setAnswers] = useState<Record<string, any>>({});
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [startTime] = useState(Date.now());
//   const { loading, endLoading } = useContext(LoadingContext);
//   const { mutate: getSurveyDetail, data: surveyData } = useMutation({
//     mutationFn: () => getSurveyDetailView(hash ?? ''),
//     onSuccess: (data) => {
//       console.log('🚀 ~ data:', data);
//       endLoading();
//     },
//   });

//   useLayoutEffect(() => {
//     getSurveyDetail();
//   }, []);

//   const survey = surveyData?.payload;

//   const currentQuestion = survey?.questions[currentStep];
//   const isLastQuestion = currentStep === (survey?.questions.length || 0) - 1;
//   const progress = survey ? ((currentStep + 1) / survey.questions.length) * 100 : 0;

//   const handleAnswerChange = (questionId: number, value: any) => {
//     setAnswers({ ...answers, [questionId]: value });
//     // Clear error when user provides answer
//     if (errors[questionId]) {
//       setErrors({ ...errors, [questionId]: '' });
//     }
//   };

//   const validateCurrentQuestion = () => {
//     if (!currentQuestion) return true;

//     const answer = answers[currentQuestion.id];
//     const newErrors = { ...errors };

//     if (currentQuestion.isRequired) {
//       if (answer === undefined || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
//         newErrors[currentQuestion.id] = '이 질문은 필수입니다';
//         setErrors(newErrors);
//         return false;
//       }
//     }

//     if (currentQuestion.dataType === DataType.Email && answer) {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(answer)) {
//         newErrors[currentQuestion.id] = '올바른 이메일 형식을 입력해주세요';
//         setErrors(newErrors);
//         return false;
//       }
//     }

//     // if (currentQuestion.dataType === DataType.Phone && answer) {
//     //   const phoneRegex = /^[0-9-+\s()]+$/;
//     //   if (!phoneRegex.test(answer)) {
//     //     newErrors[currentQuestion.id] = '올바른 전화번호 형식을 입력해주세요';
//     //     setErrors(newErrors);
//     //     return false;
//     //   }
//     // }

//     return true;
//   };

//   const handleNext = () => {
//     setDirection('next');
//     if (validateCurrentQuestion()) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handlePrevious = () => {
//     setDirection('previous');
//     setCurrentStep(Math.max(0, currentStep - 1));
//   };

//   const handleSubmit = async () => {
//     if (survey?.isOwner) {
//       addNotice('설문 작성자는 응답할 수 없습니다.', 'warning');
//       return;
//     }

//     if (!validateCurrentQuestion()) return;

//     setIsSubmitting(true);

//     try {
//       const responseTime = Date.now() - startTime;
//       const submissionData = {
//         surveyId: survey?.id ?? '',
//         answers,
//         responseTime,
//         timestamp: new Date().toISOString(),
//       };

//       console.log('Survey submitted:', submissionData);
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Failed to submit survey:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderQuestion = (question: QuestionDetailNestedResponseDto) => {
//     const answer = answers[question.id];
//     const hasError = !!errors[question.id];
//     console.log('🚀 ~ renderQuestion ~ question:', question);

//     switch (question.questionType) {
//       case QuestionType.SingleChoice:
//         return (
//           <FormControl component="fieldset" fullWidth error={hasError}>
//             <RadioGroup value={answer || ''} onChange={(e) => handleAnswerChange(question.id, e.target.value)}>
//               {question.questionOptions?.map((option) => (
//                 <FormControlLabel
//                   key={option.id}
//                   value={option.label}
//                   control={<Radio />}
//                   label={option.label}
//                   sx={{
//                     mb: 1,
//                     p: 2,
//                     border: '1px solid',
//                     borderColor: answer === option.label ? 'primary.main' : 'divider',
//                     borderRadius: 2,
//                     transition: 'all 0.2s',
//                     '&:hover': {
//                       backgroundColor: 'action.hover',
//                     },
//                   }}
//                 />
//               ))}
//             </RadioGroup>
//           </FormControl>
//         );

//       case QuestionType.MultipleChoice:
//         return (
//           <FormControl component="fieldset" fullWidth error={hasError}>
//             <FormGroup>
//               {question.questionOptions?.map((option) => (
//                 <FormControlLabel
//                   key={option.id}
//                   control={
//                     <Checkbox
//                       checked={(answer || []).includes(option.label)}
//                       onChange={(e) => {
//                         const currentAnswers = answer || [];
//                         const newAnswers = e.target.checked
//                           ? [...currentAnswers, option.label]
//                           : currentAnswers.filter((a: string) => a !== option.label);
//                         handleAnswerChange(question.id, newAnswers);
//                       }}
//                     />
//                   }
//                   label={option.label}
//                   sx={{
//                     mb: 1,
//                     p: 2,
//                     border: '1px solid',
//                     borderColor: (answer || []).includes(option.label) ? 'primary.main' : 'divider',
//                     borderRadius: 2,
//                     transition: 'all 0.2s',
//                     '&:hover': {
//                       backgroundColor: 'action.hover',
//                     },
//                   }}
//                 />
//               ))}
//             </FormGroup>
//           </FormControl>
//         );

//       case QuestionType.ShortText: {
//         switch (question.dataType) {
//           case DataType.Rating:
//             return (
//               <Box sx={{ textAlign: 'center' }}>
//                 <Rating
//                   size="large"
//                   value={answer || 0}
//                   onChange={(_, value) => handleAnswerChange(question.id, value)}
//                   sx={{ fontSize: '3rem', mb: 2 }}
//                 />
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     maxWidth: 300,
//                     mx: 'auto',
//                   }}
//                 >
//                   <Typography variant="caption" color="text.secondary">
//                     매우 불만족
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     매우 만족
//                   </Typography>
//                 </Box>
//               </Box>
//             );

//           // case 'slider':
//           //   return (
//           //     <Box sx={{ px: 2 }}>
//           //       <Box sx={{ textAlign: 'center', mb: 4 }}>
//           //         <Typography variant="h2" color="primary.main" sx={{ fontWeight: 'bold' }}>
//           //           {answer || question.min || 0}
//           //         </Typography>
//           //         <Typography variant="body2" color="text.secondary">
//           //           점
//           //         </Typography>
//           //       </Box>
//           //       <Slider
//           //         value={answer || question.min || 0}
//           //         onChange={(_, value) => handleAnswerChange(question.id, value)}
//           //         min={question.min || 0}
//           //         max={question.max || 10}
//           //         step={question.step || 1}
//           //         marks
//           //         valueLabelDisplay="auto"
//           //         sx={{ mb: 2 }}
//           //       />
//           //       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//           //         <Typography variant="caption" color="text.secondary">
//           //           {question.min || 0}점
//           //         </Typography>
//           //         <Typography variant="caption" color="text.secondary">
//           //           {question.max || 10}점
//           //         </Typography>
//           //       </Box>
//           //     </Box>
//           //   );

//           case DataType.Email:
//             return (
//               <TextField
//                 fullWidth
//                 type="email"
//                 value={answer || ''}
//                 onChange={(e) => handleAnswerChange(question.id, e.target.value)}
//                 placeholder="example@email.com"
//                 error={hasError}
//                 helperText={errors[question.id]}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                   },
//                 }}
//               />
//             );

//           // case DataType.Phone:
//           //   return (
//           //     <TextField
//           //       fullWidth
//           //       type="tel"
//           //       value={answer || ''}
//           //       onChange={(e) => handleAnswerChange(question.id, e.target.value)}
//           //       placeholder="010-1234-5678"
//           //       error={hasError}
//           //       helperText={errors[question.id]}
//           //       sx={{
//           //         '& .MuiOutlinedInput-root': {
//           //           borderRadius: 2,
//           //         },
//           //       }}
//           //     />
//           //   );

//           case DataType.Image:
//             return (
//               <Box
//                 sx={{
//                   border: '2px dashed',
//                   borderColor: 'divider',
//                   borderRadius: 2,
//                   p: 4,
//                   textAlign: 'center',
//                   cursor: 'pointer',
//                   transition: 'all 0.2s',
//                   '&:hover': {
//                     borderColor: 'primary.main',
//                     backgroundColor: 'action.hover',
//                   },
//                 }}
//               >
//                 <PhotoCamera sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//                 <Typography variant="body1" color="text.secondary">
//                   이미지를 업로드하려면 클릭하세요
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   JPG, PNG 파일만 지원 (최대 5MB)
//                 </Typography>
//               </Box>
//             );

//           case DataType.Text:
//           default:
//             return (
//               <TextField
//                 fullWidth
//                 multiline
//                 rows={4}
//                 value={answer || ''}
//                 onChange={(e) => handleAnswerChange(question.id, e.target.value)}
//                 placeholder="의견을 자유롭게 작성해주세요..."
//                 error={hasError}
//                 helperText={errors[question.id]}
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: 2,
//                   },
//                 }}
//               />
//             );
//         }
//       }

//       case QuestionType.LongText:
//         return (
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             value={answer || ''}
//             onChange={(e) => handleAnswerChange(question.id, e.target.value)}
//             placeholder="의견을 자유롭게 작성해주세요..."
//             error={hasError}
//             helperText={errors[question.id]}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: 2,
//               },
//             }}
//           />
//         );

//       default:
//         return null;
//     }
//   };

//   if (loading) {
//     return (
//       <Container maxWidth="md" sx={{ py: 8 }}>
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             minHeight: '50vh',
//           }}
//         >
//           <CircularProgress size={60} />
//         </Box>
//       </Container>
//     );
//   }

//   if (!survey) {
//     return (
//       <Container maxWidth="md" sx={{ py: 8 }}>
//         <Alert severity="error" sx={{ textAlign: 'center' }}>
//           설문을 찾을 수 없습니다. URL을 확인해주세요.
//         </Alert>
//       </Container>
//     );
//   }

//   if (isSubmitted) {
//     return (
//       <Container maxWidth="md" sx={{ py: 8 }}>
//         <motion.div
//           key={currentStep}
//           initial={{ opacity: 0, x: direction === 'next' ? 100 : -100 }}
//           animate={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: direction === 'next' ? -100 : 100 }}
//           transition={{ duration: 0.3 }}
//         >
//           <Card
//             sx={{
//               textAlign: 'center',
//               p: 6,
//               background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
//             }}
//           >
//             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
//               <CheckCircle sx={{ fontSize: 100, color: 'success.main', mb: 3 }} />
//             </motion.div>

//             <Typography variant="h3" sx={{ mb: 2, fontWeight: 600, color: 'white' }}>
//               응답이 완료되었습니다!
//             </Typography>

//             <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)' }}>
//               소중한 의견을 주셔서 감사합니다
//             </Typography>

//             <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
//               <Chip
//                 icon={<Person />}
//                 label={`총 ${survey.totalResponses + 1}명 참여`}
//                 sx={{
//                   backgroundColor: 'rgba(255,255,255,0.2)',
//                   color: 'white',
//                 }}
//               />
//               <Chip
//                 icon={<ThumbUp />}
//                 label="피드백 반영 예정"
//                 sx={{
//                   backgroundColor: 'rgba(255,255,255,0.2)',
//                   color: 'white',
//                 }}
//               />
//             </Box>

//             <Button
//               variant="contained"
//               href="/"
//               size="large"
//               sx={{
//                 backgroundColor: 'white',
//                 color: 'primary.main',
//                 '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
//               }}
//             >
//               홈으로 돌아가기
//             </Button>
//           </Card>
//         </motion.div>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       {/* 설문 헤더 */}
//       <Card sx={{ mb: 4, overflow: 'visible' }}>
//         <CardContent sx={{ p: 4 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//             <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>{survey.author.profileUrl}</Avatar>
//             <Box>
//               <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                 {survey.author.name}
//               </Typography>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
//                 <Chip icon={<Schedule />} label={`약 ${survey.estimatedTime}분`} size="small" />
//                 <Chip icon={<Person />} label={`${survey.totalResponses}명 참여`} size="small" />
//               </Box>
//             </Box>
//           </Box>

//           <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
//             {survey.title}
//           </Typography>

//           <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
//             {survey.description}
//           </Typography>
//         </CardContent>
//       </Card>

//       {/* 진행률 */}
//       <Card sx={{ mb: 4 }}>
//         <CardContent sx={{ p: 3 }}>
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               mb: 2,
//             }}
//           >
//             <Typography variant="body2" color="text.secondary">
//               진행률
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {currentStep + 1} / {survey.questionCount}
//             </Typography>
//           </Box>
//           <LinearProgress
//             variant="determinate"
//             value={progress}
//             sx={{
//               height: 8,
//               borderRadius: 4,
//               backgroundColor: 'action.hover',
//               '& .MuiLinearProgress-bar': {
//                 borderRadius: 4,
//               },
//             }}
//           />
//         </CardContent>
//       </Card>

//       {/* 질문 카드 */}
//       <AnimatePresence mode="wait">
//         {currentQuestion && (
//           <motion.div
//             key={currentQuestion.id}
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -50 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Card sx={{ mb: 4 }}>
//               <CardContent sx={{ p: 4 }}>
//                 <Box sx={{ mb: 4 }}>
//                   <Box
//                     sx={{
//                       display: 'flex',
//                       alignItems: 'flex-start',
//                       gap: 2,
//                       mb: 2,
//                     }}
//                   >
//                     <Typography variant="h5" sx={{ fontWeight: 600, flexGrow: 1 }}>
//                       {currentStep + 1}. {currentQuestion.title}
//                     </Typography>
//                     {currentQuestion.isRequired && <Chip label="필수" size="small" color="primary" />}
//                   </Box>

//                   {currentQuestion.description && (
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//                       {currentQuestion.description}
//                     </Typography>
//                   )}
//                 </Box>

//                 {renderQuestion(currentQuestion)}

//                 {errors[currentQuestion.id] && (
//                   <Fade in>
//                     <Alert severity="error" sx={{ mt: 2 }}>
//                       {errors[currentQuestion.id]}
//                     </Alert>
//                   </Fade>
//                 )}
//               </CardContent>
//             </Card>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* 네비게이션 버튼 */}
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <Button variant="outlined" startIcon={<ArrowBack />} onClick={handlePrevious} disabled={currentStep === 0} sx={{ minWidth: 120 }}>
//           이전
//         </Button>

//         <Box sx={{ display: 'flex', gap: 1 }}>
//           {Array.from({ length: survey.questionCount }).map((_, index) => (
//             <Box
//               key={index}
//               sx={{
//                 width: 8,
//                 height: 8,
//                 borderRadius: '50%',
//                 backgroundColor: index <= currentStep ? 'primary.main' : 'action.disabled',
//                 transition: 'all 0.3s',
//               }}
//             />
//           ))}
//         </Box>

//         {isLastQuestion ? (
//           <Button
//             variant="contained"
//             startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//             sx={{ minWidth: 120 }}
//           >
//             {isSubmitting ? '제출 중...' : '제출하기'}
//           </Button>
//         ) : (
//           <Button variant="contained" endIcon={<ArrowForward />} onClick={handleNext} sx={{ minWidth: 120 }}>
//             다음
//           </Button>
//         )}
//       </Box>

//       {/* 하단 정보 */}
//       <Box sx={{ mt: 6, textAlign: 'center' }}>
//         <Divider sx={{ mb: 3 }} />
//         <Typography variant="caption" color="text.secondary">
//           이 설문은 Nuvia로 제작되었습니다 • 모든 응답은 안전하게 보호됩니다
//         </Typography>
//       </Box>
//     </Container>
//   );
// }

export default function SurveyDetail({ hash }: { hash: string }) {
  const { addNotice } = useContext(GlobalSnackbarContext);
  const { endLoading } = useContext(LoadingContext);
  const { mutate: getSurveyDetail, data: surveyData } = useMutation({
    mutationFn: () => getSurveyDetailView(hash ?? ''),
    onSuccess: () => {
      endLoading();
    },
    onError: (error: AxiosError<ServerResponse<void>>) => {
      addNotice(error?.response?.data?.message ?? '설문을 찾을 수 없습니다.', 'error');
    },
  });

  useLayoutEffect(() => {
    getSurveyDetail();
  }, []);

  if (!surveyData || !surveyData.payload) {
    return null;
  }

  const surveyDataWithAnswers = {
    ...surveyData.payload,
    questions: surveyData.payload.questions.map((question, idx) => ({
      ...question,
      idx: Date.now() + idx,
      questionOptions: question.questionOptions?.map((option, idx) => ({ ...option, idx: Date.now() + idx })),
      answers: new Map(),
      isAnswered: false,
    })),
  };

  return <ResponseSurvey survey={surveyDataWithAnswers} />;
}
