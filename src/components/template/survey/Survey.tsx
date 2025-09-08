'use client';

import { CreateSurveyPayload } from '@/models/CreateSurveyPayload';
import { GetSurveyDetailResponse } from '@/models/GetSurveyDetailResponse';
import { UpdateSurveyPayload } from '@/models/UpdateSurveyPayload';
import { createSurvey } from '@api/create-survey';
import { getCategories } from '@api/get-categories';
import { getSurveyDetail } from '@api/get-survey-detail';
import { updateSurvey } from '@api/update-survey';
import Loading from '@components/atom/Loading';
import { AddQuestionSheet } from '@components/molecular/AddQuestionSheet';
import Preview from '@components/organism/Preview';
import QuestionCard from '@components/organism/QuestionCard';
import { AuthenticationContext } from '@context/AuthenticationContext';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import { useLoading } from '@hooks/useLoading';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { SurveyStatus } from '@share/enums/survey-status';
import { UserRole } from '@share/enums/user-role';
import { ICategory } from '@share/interface/icategory';
import { AllQuestion } from '@share/interface/iquestion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LocalizationManager } from '@util/LocalizationManager';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';

// --- VALIDATION SCHEMA ---
const SurveySchema = Yup.object().shape({
  title: Yup.string().required('설문 제목은 필수입니다.'),
  description: Yup.string(),
  categoryId: Yup.number().required('카테고리는 필수입니다.'),
  status: Yup.string().required('상태는 필수입니다.'),
  expiresAt: Yup.string().nullable(),
  isPublic: Yup.boolean().required('응답 공개 여부는 필수입니다.'),
  questions: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().nullable(),
      title: Yup.string().required('질문 제목은 필수입니다.'),
      description: Yup.string().nullable(),
      questionType: Yup.string().required('질문 유형은 필수입니다.'),
      dataType: Yup.string().required('데이터 유형은 필수입니다.'),
      isRequired: Yup.boolean().required('필수 여부는 필수입니다.'),
      // isAnswered: Yup.boolean().required(),
      questionOptions: Yup.array().of(
        Yup.object().shape({
          id: Yup.number().nullable(),
          label: Yup.string().required('옵션 라벨은 필수입니다.'),
          description: Yup.string().nullable(),
          sequence: Yup.number(),
        }),
      ),
      // answers: Yup.mixed().required(),
    }),
  ),
});

// --- INITIAL VALUES ---
const initialValues: QuestionInitialValues = {
  title: '',
  description: '',
  categoryId: '',
  status: SurveyStatus.Draft,
  expiresAt: null as Date | null,
  isPublic: true,
  questions: [] as AllQuestion[],
};

// --- COMPONENT ---
const Survey: React.FC<{ id?: string }> = ({ id }) => {
  /* hooks */
  const { contentLoaded } = useLoading({
    forUser: true,
    verifiedRoute: '/survey',
    unverifiedRoute: '/auth/login',
    ifRole: [UserRole.Viewer, '/survey'],
  });
  const { addNotice } = useContext(GlobalSnackbarContext);
  const router = useRouter();
  const theme = useTheme();
  const { user } = useContext(AuthenticationContext);

  /* state */
  const SUBMIT_BUTTON_TEXT = id ? '설문 수정' : '설문 저장';
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<ServerResponse<ICategory[]>>({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });
  const { data: surveyData, isLoading: isSurveyLoading } = useQuery<ServerResponse<GetSurveyDetailResponse>>({
    queryKey: ['survey', id],
    queryFn: () => getSurveyDetail(id as string),
    enabled: !!id,
  });
  const { mutate: createSurveyMutate } = useMutation({
    mutationKey: ['createSurvey'],
    mutationFn: ({ surveyData }: { surveyData: CreateSurveyPayload }) => createSurvey(surveyData),
    onSuccess: (data) => {
      if (data.ok) {
        addNotice((data.reason as string) || data.message, 'success');
        // Reset form
        router.push('/survey');
      } else {
        addNotice((data.reason as string) || data.message, 'error');
      }
      setIsSubmitting(false);
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ServerResponse<any>>;
      console.error(axiosError);
      if (axiosError?.response?.data?.reason === 'expiresAt') {
        addNotice('만료 일시는 최소 다음날부터 가능합니다.', 'error');
      } else {
        addNotice(
          ((axiosError?.response?.data?.reason as string) || axiosError?.response?.data?.message) ??
            '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          'error',
        );
      }
      setIsSubmitting(false);
    },
  });

  // --- FORMIK ---
  const formik = useFormik({
    initialValues,
    validationSchema: SurveySchema,
    onSubmit: async (values) => {
      if (id) {
        handleUpdateSurvey(id, values);
      } else {
        handleSaveSurvey(values);
      }
    },
  });

  useEffect(() => {
    if (!contentLoaded || isSurveyLoading || isCategoriesLoading) return;

    if (surveyData?.payload) {
      const payload = surveyData.payload;
      formik.setValues({
        title: payload.title,
        description: payload.description,
        categoryId: payload.category.id.toString(),
        status: payload.status,
        expiresAt: payload.expiresAt,
        isPublic: payload.isPublic,
        questions: payload.questions.map((question) => ({
          id: question.id,
          idx: question.id ?? Date.now(),
          title: question.title,
          description: question.description,
          questionType: question.questionType,
          dataType: question.dataType,
          isRequired: question.isRequired,
          sequence: question.sequence,
          questionOptions: question.questionOptions.map((option) => ({
            id: option.id,
            idx: option.id ?? Date.now(),
            label: option.label,
            description: option.description,
            sequence: option.sequence,
          })),
          questionAnswers: new Map(),
          isAnswered: false,
        })),
      });
    }
  }, [surveyData]);

  useEffect(() => {
    if (formik.isSubmitting && Object.keys(formik.errors).length > 0) {
      console.log(formik.errors);
      addNotice('설문에 필요한 내용을 작성해주세요.', 'warning');
    }
  }, [formik.errors, formik.touched]);

  function validateAndReturnSurveyData(values: QuestionInitialValues) {
    for (let i = 0; i < values.questions.length; i++) {
      const question = values.questions[i];
      if (
        (question.questionType === QuestionType.SingleChoice || question.questionType === QuestionType.MultipleChoice) &&
        question.questionOptions?.length === 0
      ) {
        formik.setFieldTouched(`questions[${i}].questionOptions`, true);
        formik.setFieldError(`questions[${i}].questionOptions`, '최소 1개의 옵션이 필요합니다.');
        return;
      }
    }

    setIsSubmitting(true);

    if (id) {
      const surveyData: UpdateSurveyPayload = {
        surveyFormData: {
          categoryId: +values.categoryId,
          title: values.title,
          description: values.description,
          expiresAt: values.expiresAt || null,
          isPublic: values.isPublic,
          status: values.status,
        },
        surveyQuestionData: values.questions.map((question) => ({
          id: question.id,
          title: question.title,
          description: question.description,
          questionType: question.questionType,
          dataType: question.dataType,
          isRequired: question.isRequired,
          sequence: question.sequence,
          questionOptions: (question.questionOptions || []).map((option) => ({
            id: option.id,
            label: option.label,
            sequence: option.sequence,
          })),
          questionAnswers: new Map(),
          isAnswered: false,
        })),
      };

      return surveyData;
    } else {
      const surveyData: CreateSurveyPayload = {
        categoryId: +values.categoryId,
        title: values.title,
        description: values.description,
        expiresAt: values.expiresAt || null,
        isPublic: values.isPublic,
        status: values.status,
        questions: values.questions.map(({ id, idx, ...rest }) => ({
          title: rest.title,
          description: rest.description,
          questionType: rest.questionType,
          dataType: rest.dataType,
          isRequired: rest.isRequired,
          sequence: rest.sequence,
          questionOptions: (rest.questionOptions || []).map(({ id, idx, ...optRest }) => ({
            label: optRest.label,
            sequence: optRest.sequence,
          })), // Remove client-side IDs
          questionAnswers: new Map(),
          isAnswered: false,
        })),
        // managementPassword: managementPassword,
      };

      return surveyData;
    }
  }

  async function handleSaveSurvey(values: QuestionInitialValues) {
    const surveyData = validateAndReturnSurveyData(values);

    if (!surveyData) return;

    // Using a placeholder API endpoint
    createSurveyMutate({ surveyData: surveyData as CreateSurveyPayload });
  }

  async function handleUpdateSurvey(id: string, values: QuestionInitialValues) {
    const surveyData = validateAndReturnSurveyData(values);

    if (!surveyData) return;

    try {
      // Using a placeholder API endpoint
      const response = await updateSurvey(id, surveyData as UpdateSurveyPayload);

      if (response.ok) {
        addNotice(response.reason || response.message, 'success');
        router.push('/survey');
      } else {
        addNotice(response.reason || response.message, 'error');
      }
    } catch (err: any) {
      const axiosError = err as AxiosError<ServerResponse<any>>;
      console.error(axiosError);
      addNotice(
        ((axiosError?.response?.data?.reason as string) || axiosError?.response?.data?.message) ??
          '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        'error',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // --- HANDLERS ---
  const handleAddQuestion = (questionType: QuestionType, dataType?: DataType) => {
    const isSelectable = questionType === QuestionType.SingleChoice || questionType === QuestionType.MultipleChoice;
    const newQuestion: Omit<AllQuestion, 'questionAnswers'> = {
      id: null,
      idx: Date.now(),
      title: '',
      description: null,
      questionType,
      dataType: dataType || DataType.Text,
      isRequired: false,
      // isAnswered: false,
      questionOptions: isSelectable ? [{ id: null, label: '', sequence: 0, idx: Date.now() }] : [],
      isAnswered: false,
      sequence: formik.values.questions.length ?? 0,
    };
    formik.setFieldValue('questions', [...formik.values.questions, newQuestion]);
  };

  const handlePreview = () => {
    setIsPreview(true);
  };

  const handleUpdateQuestionTitle = useCallback((index: number, newTitle: string) => {
    formik.setFieldValue(`questions[${index}]`, {
      ...formik.values.questions[index],
      title: newTitle,
    });
  }, []);
  const handleUpdateQuestionDescription = useCallback((index: number, newDescription: string) => {
    formik.setFieldValue(`questions[${index}]`, {
      ...formik.values.questions[index],
      description: newDescription,
    });
  }, []);
  const handleUpdateQuestionType = useCallback((index: number, newType: QuestionType) => {
    const isSelectable = newType === QuestionType.SingleChoice || newType === QuestionType.MultipleChoice;
    const hasOptions = formik.values.questions[index].questionOptions.length > 0;
    formik.setFieldValue(`questions[${index}]`, {
      ...formik.values.questions[index],
      questionType: newType,
      dataType: isSelectable ? DataType.Text : DataType.Text,
      questionOptions: hasOptions
        ? formik.values.questions[index].questionOptions
        : isSelectable
        ? [{ id: null, label: '', sequence: 0, idx: Date.now() }]
        : [],
    });
  }, []);
  const handleUpdateQuestionDataType = useCallback((index: number, newDataType: DataType) => {
    formik.setFieldValue(`questions[${index}]`, {
      ...formik.values.questions[index],
      dataType: newDataType,
    });
  }, []);
  const handleUpdateIsRequired = useCallback((index: number, newIsRequired: boolean) => {
    formik.setFieldValue(`questions[${index}]`, {
      ...formik.values.questions[index],
      isRequired: newIsRequired,
    });
  }, []);

  const setFieldValue = useCallback(() => formik.setFieldValue, []);
  const setFieldError = useCallback(() => formik.setFieldError, []);
  const setFieldTouched = useCallback(() => formik.setFieldTouched, []);
  const memoizeTouched = useMemo(() => formik.touched as { [key: string]: { [key: string]: boolean } }, [formik.touched]);
  const memoizeErrors = useMemo(() => formik.errors as { [key: string]: { [key: string]: any } }, [formik.errors]);

  const questions = useMemo(() => formik.values.questions, [formik.values.questions]);

  if (!user || user.role === UserRole.Viewer) {
    return <Loading />;
  }

  // --- RENDER ---
  return (
    <Container maxWidth="lg">
      <FormikProvider value={formik}>
        <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  mt: 4,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  background: (theme) => `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
                }}
              >
                <Box sx={{ mb: 5 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 1,
                      fontSize: { xs: '1.75rem', md: '2.25rem' },
                    }}
                  >
                    설문 제작
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 400,
                    }}
                  >
                    새로운 설문을 만들어보세요
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {/* 기본 정보 섹션 */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '1.125rem',
                      }}
                    >
                      기본 정보
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <TextField
                        fullWidth
                        label="설문 제목"
                        required
                        {...formik.getFieldProps('title')}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'background.paper',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            fontWeight: 500,
                          },
                        }}
                      />

                      <TextField
                        fullWidth
                        label="설문 설명 (선택)"
                        multiline
                        rows={4}
                        {...formik.getFieldProps('description')}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'background.paper',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            fontWeight: 500,
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  {/* 설정 섹션 */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '1.125rem',
                      }}
                    >
                      설정
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <DateTimePicker
                        label="만료일 (선택)"
                        value={formik.values.expiresAt ? dayjs(formik.values.expiresAt) : null}
                        onChange={(value) => formik.setFieldValue('expiresAt', value?.toISOString() || null)}
                        format="YYYY-MM-DD HH:mm"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: formik.touched.expiresAt && Boolean(formik.errors.expiresAt),
                            helperText: formik.touched.expiresAt && formik.errors.expiresAt,
                            sx: {
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'background.paper',
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'primary.main',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                fontWeight: 500,
                              },
                            },
                          },
                        }}
                      />

                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          backgroundColor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formik.values.isPublic}
                              onChange={formik.handleChange}
                              name="isPublic"
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: 'primary.main',
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                  backgroundColor: 'primary.main',
                                },
                              }}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                응답 공개 여부
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                다른 사용자들이 응답 결과를 볼 수 있습니다
                              </Typography>
                            </Box>
                          }
                        />
                      </Box>

                      <Box>
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                          설문 상태
                        </Typography>
                        <RadioGroup
                          row
                          aria-labelledby="status-radio-buttons-group-label"
                          name="status"
                          value={formik.values.status}
                          onChange={formik.handleChange}
                          sx={{ gap: 2 }}
                        >
                          <FormControlLabel
                            value={SurveyStatus.Draft}
                            control={
                              <Radio
                                sx={{
                                  '&.Mui-checked': {
                                    color: 'warning.main',
                                  },
                                }}
                              />
                            }
                            label={
                              <Box sx={{ ml: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {LocalizationManager.translate(SurveyStatus.Draft)}
                                </Typography>
                              </Box>
                            }
                          />
                          <FormControlLabel
                            value={SurveyStatus.Active}
                            control={
                              <Radio
                                sx={{
                                  '&.Mui-checked': {
                                    color: 'success.main',
                                  },
                                }}
                              />
                            }
                            label={
                              <Box sx={{ ml: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {LocalizationManager.translate(SurveyStatus.Active)}
                                </Typography>
                              </Box>
                            }
                          />
                          <FormControlLabel
                            value={SurveyStatus.Closed}
                            control={
                              <Radio
                                sx={{
                                  '&.Mui-checked': {
                                    color: 'error.main',
                                  },
                                }}
                              />
                            }
                            label={
                              <Box sx={{ ml: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {LocalizationManager.translate(SurveyStatus.Closed)}
                                </Typography>
                              </Box>
                            }
                          />
                        </RadioGroup>
                      </Box>

                      <Box>
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                          카테고리 (선택)
                        </Typography>
                        <Select
                          fullWidth
                          {...formik.getFieldProps('categoryId')}
                          defaultValue=""
                          error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                          displayEmpty
                          sx={{
                            borderRadius: 2,
                            backgroundColor: 'background.paper',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            },
                            '& .MuiSelect-select': {
                              fontWeight: 400,
                            },
                          }}
                        >
                          <MenuItem value="" sx={{ color: 'text.secondary' }}>
                            카테고리를 선택해주세요
                          </MenuItem>
                          {categories?.payload?.map((category) => (
                            <MenuItem key={category.id.toString()} value={category.id.toString()} sx={{ fontWeight: 400 }}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {formik.touched.categoryId && formik.errors.categoryId && (
                          <FormHelperText error sx={{ ml: 0, mt: 1 }}>
                            {formik.errors.categoryId}
                          </FormHelperText>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {questions.map((question, index, originQuestions) => (
                <QuestionCard
                  key={question.idx}
                  idx={question.idx}
                  index={index}
                  title={question.title}
                  description={question.description ?? ''}
                  questionType={question.questionType}
                  dataType={question.dataType}
                  isRequired={question.isRequired}
                  questionOptions={question.questionOptions}
                  questions={originQuestions}
                  handleUpdateQuestionTitle={handleUpdateQuestionTitle}
                  handleUpdateQuestionDescription={handleUpdateQuestionDescription}
                  handleUpdateQuestionType={handleUpdateQuestionType}
                  handleUpdateQuestionDataType={handleUpdateQuestionDataType}
                  handleUpdateIsRequired={handleUpdateIsRequired}
                  // setFieldValue={setFieldValue}
                  setFieldError={setFieldError}
                  setFieldTouched={setFieldTouched}
                  touched={memoizeTouched}
                  errors={memoizeErrors}
                />
              ))}

              <Box
                sx={{
                  my: 6,
                  p: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'background.paper',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => handleAddQuestion(QuestionType.ShortText)}
                  sx={{
                    borderRadius: 2.5,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    fontWeight: 500,
                    textTransform: 'none',
                    // '&:hover': {
                    //   backgroundColor: 'primary.main',
                    //   color: 'white',
                    //   borderColor: 'primary.main',
                    // },
                  }}
                >
                  질문 추가
                </Button>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="text"
                    onClick={() => console.log('임시 저장 클릭')}
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: 2.5,
                      color: 'text.secondary',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        color: 'text.primary',
                      },
                    }}
                  >
                    임시 저장
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handlePreview}
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: 2.5,
                      borderColor: 'divider',
                      color: 'text.primary',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        borderColor: 'text.primary',
                      },
                    }}
                  >
                    미리보기
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={isSubmitting ? null : <SaveIcon />}
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: 2.5,
                      backgroundColor: 'primary.main',
                      fontWeight: 600,
                      textTransform: 'none',
                      // boxShadow: `0 4px 12px ${theme.palette.primary.dark}`,
                      // '&:hover': {
                      //   backgroundColor: 'primary.dark',
                      //   boxShadow: `0 6px 16px ${theme.palette.primary.dark}`,
                      // },
                      // '&:disabled': {
                      //   backgroundColor: 'action.disabledBackground',
                      //   color: 'action.disabled',
                      //   boxShadow: 'none',
                      // },
                    }}
                  >
                    {isSubmitting ? <CircularProgress size={20} color="inherit" /> : SUBMIT_BUTTON_TEXT}
                  </Button>
                </Stack>
              </Box>
            </Grid>

            <AddQuestionSheet onPick={(qType, dType) => handleAddQuestion(qType, dType)} isMobile={isMobile} />
          </Grid>
        </Box>
      </FormikProvider>

      {isPreview && (
        <Preview
          isDemo
          survey={{
            id: id ? Number(id) : null,
            hashedUniqueKey: '',
            subscriptionId: 0,
            viewCount: 0,
            estimatedTime: 0,
            totalResponses: 0,
            questionAnswers: [],
            questionCount: 0,
            respondentCount: 0,
            isOwner: false,
            title: formik.values.title,
            author: {
              id: 0,
              name: '미리보기 사용자',
              profileUrl: null,
            },
            description: formik.values.description,
            category: categories?.payload?.find((category) => category.id === Number(formik.values.categoryId)) || { id: 0, name: '' },
            expiresAt: formik.values.expiresAt || new Date(),
            isPublic: formik.values.isPublic,
            status: formik.values.status,
            createdAt: new Date(),
            updatedAt: new Date(),
            questions: formik.values.questions.map((question) => ({
              ...question,
              id: question.id,
              idx: question.idx,
              title: question.title,
              description: question.description,
              questionType: question.questionType,
              dataType: question.dataType,
              isRequired: question.isRequired,
              questionOptions: question.questionOptions,
              sequence: question.sequence,
            })),
          }}
          handleClose={() => setIsPreview(false)}
        />
      )}
    </Container>
  );
};

export default Survey;
