'use client';

import { CreateSurveyPayload } from '@/models/CreateSurveyPayload';
import { GetSurveyDetailResponse } from '@/models/GetSurveyDetailResponse';
import { UpdateSurveyPayload } from '@/models/UpdateSurveyPayload';
import { useAuthStore } from '@/store/auth.store';
import mutationKeys from '@/store/lib/mutation-key';
import queryKeys from '@/store/lib/query-key';
import { createSurvey } from '@api/survey/create-survey';
import { getCategories } from '@api/survey/get-categories';
import { getSurveyDetail } from '@api/survey/get-survey-detail';
import { updateSurvey } from '@api/survey/update-survey';
import ActionButton from '@components/atom/ActionButton';
import Loading from '@components/atom/Loading';
import { AddQuestionSheet } from '@components/molecular/AddQuestionSheet';
import Preview from '@components/organism/Preview';
import QuestionCard from '@components/organism/QuestionCard';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import { Box, CircularProgress, Container, Grid, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { SurveyStatus } from '@share/enums/survey-status';
import { UserRole } from '@share/enums/user-role';
import { ICategory } from '@share/interface/icategory';
import { AllQuestion, IQuestion, IQuestionOption } from '@share/interface/iquestion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FormikErrors, useFormik } from 'formik';
import { useCallback, useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import SurveyInformation from './SurveyInformation';
import { useEventBus } from '@/store/event-bus.store';
import { AppEventType } from '@/store/lib/app-event';

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
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const router = useAuthStore((state) => state.router)!;
  const addNotice = useAuthStore((state) => state.addNotice)!;
  const { handleOpenDialog } = useContext(GlobalDialogContext);
  const publish = useEventBus((s) => s.publish);
  /* state */
  const SUBMIT_BUTTON_TEXT = id ? '설문 수정' : '설문 저장';
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<ServerResponse<ICategory[]>>({
    queryKey: queryKeys.category.list(),
    queryFn: () => getCategories(),
  });
  const { data: surveyData, isLoading: isSurveyLoading } = useQuery<ServerResponse<GetSurveyDetailResponse>>({
    queryKey: queryKeys.survey.detail(+id!),
    queryFn: () => getSurveyDetail(id as string),
    enabled: !!id,
  });
  const { mutate: tempSaveSurveyMutate } = useMutation({
    mutationKey: mutationKeys.survey.create(),
    mutationFn: ({ surveyData }: { surveyData: CreateSurveyPayload }) => createSurvey(surveyData),
    onSuccess: (data) => {
      if (data.ok) {
        addNotice(data.message, 'success');
        // Reset form
        router.push(`?edit=${data.payload!.id}`, { scroll: false });
      } else {
        addNotice(data.message, 'error');
      }
      setIsSubmitting(false);
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ServerResponse<any>>;
      // console.error(axiosError);
      if (axiosError?.response?.data?.reason === 'expiresAt') {
        addNotice('만료 일시는 최소 다음날부터 가능합니다.', 'error');
      } else {
        if (axiosError?.response?.data?.reason === 'questions') {
          addNotice('최소 1개의 질문이 필요합니다.', 'error');
        } else {
          addNotice(
            ((axiosError?.response?.data?.reason as string) || axiosError?.response?.data?.message) ??
              '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            'error',
          );
        }
      }
      setIsSubmitting(false);
    },
  });
  const { mutate: createSurveyMutate } = useMutation({
    mutationKey: mutationKeys.survey.create(),
    mutationFn: ({ surveyData }: { surveyData: CreateSurveyPayload }) => createSurvey(surveyData),
    onSuccess: (data) => {
      if (data.ok) {
        addNotice((data.reason as string) || data.message, 'success');
        // Reset form
        router.push('/dashboard/survey');
        publish({ type: AppEventType.SURVEY_UPDATED });
      } else {
        addNotice((data.reason as string) || data.message, 'error');
      }
      setIsSubmitting(false);
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ServerResponse<any>>;
      if (axiosError?.response?.data?.reason === 'expiresAt') {
        addNotice('만료 일시는 최소 다음날부터 가능합니다.', 'error');
      } else {
        if (axiosError?.response?.data?.reason === 'questions') {
          addNotice('최소 1개의 질문이 필요합니다.', 'error');
        } else {
          addNotice(
            ((axiosError?.response?.data?.reason as string) || axiosError?.response?.data?.message) ??
              '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            'error',
          );
        }
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
    if (isSurveyLoading || isCategoriesLoading) return;

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
          // isAnswered: false,
        })),
      });
    }
  }, [surveyData]);

  useEffect(() => {
    if (formik.isSubmitting && Object.keys(formik.errors).length > 0) {
      // console.log(formik.errors);
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
          // questionAnswers: new Map(),
          // isAnswered: false,
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
          // questionAnswers: new Map(),
          // isAnswered: false,
        })),
        // managementPassword: managementPassword,
      };

      return surveyData;
    }
  }

  async function handleSaveTemporarySurvey(values: QuestionInitialValues) {
    const surveyData = validateAndReturnSurveyData(values);

    if (!surveyData) return;

    tempSaveSurveyMutate({ surveyData: surveyData as unknown as CreateSurveyPayload });
  }

  async function handleUpdateTemporarySurvey(id: string, values: QuestionInitialValues) {
    const surveyData = validateAndReturnSurveyData(values);

    if (!surveyData) return;

    try {
      // Using a placeholder API endpoint
      const response = await updateSurvey(id, surveyData as UpdateSurveyPayload);

      if (response.ok) {
        addNotice(response.reason || response.message, 'success');
      } else {
        addNotice(response.reason || response.message, 'error');
      }
    } catch (err: any) {
      const axiosError = err as AxiosError<ServerResponse<any>>;
      // console.error(axiosError);
      addNotice(
        ((axiosError?.response?.data?.reason as string) || axiosError?.response?.data?.message) ??
          '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        'error',
      );
    } finally {
      setIsSubmitting(false);
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
        router.push('/dashboard/survey');
        publish({ type: AppEventType.SURVEY_UPDATED });
      } else {
        addNotice(response.reason || response.message, 'error');
      }
    } catch (err: any) {
      const axiosError = err as AxiosError<ServerResponse<any>>;
      // console.error(axiosError);
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
  const handleAddQuestion = useCallback((questionType: QuestionType, dataType?: DataType) => {
    const isSelectable = questionType === QuestionType.SingleChoice || questionType === QuestionType.MultipleChoice;
    formik.setValues((prevValues) => {
      const nextValues = { ...prevValues };
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
        // isAnswered: false,
        sequence: formik.values.questions.length ?? 0,
      };
      nextValues.questions = [...nextValues.questions, newQuestion as Omit<AllQuestion, 'answers' | 'isAnswered'>];
      return nextValues;
    });
  }, []);

  const handleRemoveQuestion = useCallback((questionIndex: number) => {
    function confirmRemoveQuestion() {
      formik.setValues((prevValues) => {
        if (prevValues.questions.length === 1) {
          addNotice('최소 1개의 질문이 필요합니다.', 'error');
          return prevValues;
        }
        const nextValues = { ...prevValues };
        const nextQuestions = [...nextValues.questions];
        nextQuestions.splice(questionIndex, 1);
        nextValues.questions = nextQuestions;
        addNotice('질문이 삭제되었습니다.', 'success');
        return nextValues;
      });
    }

    handleOpenDialog({
      title: '질문 삭제',
      content: '삭제된 질문은 복구 불가합니다. 삭제하시겠습니까?',
      actionCallback: confirmRemoveQuestion,
      useConfirm: true,
      type: 'error',
    });
  }, []);

  const handleAddOption = useCallback((questionIndex: number) => {
    formik.setValues((prevValues) => {
      const nextValues = { ...prevValues };
      const nextQuestions = [...nextValues.questions];
      const targetQuestion = nextQuestions[questionIndex];
      if (!targetQuestion) return prevValues;
      const nextOptions = [...(targetQuestion.questionOptions || []), { idx: Date.now(), label: '' }];
      nextQuestions[questionIndex] = { ...targetQuestion, questionOptions: nextOptions as IQuestionOption[] };
      nextValues.questions = nextQuestions;
      return nextValues;
    });
  }, []);

  const handleRemoveOption = useCallback((questionIndex: number, optionIdx: number | string) => {
    formik.setValues((prevValues) => {
      if (prevValues.questions[questionIndex].questionOptions?.length === 1) {
        // 해당 질문의 options 필드를 touched로 설정
        formik.setFieldTouched(`questions.${questionIndex}.questionOptions`, true);
        // 에러 메시지 설정
        formik.setFieldError(`questions.${questionIndex}.questionOptions`, '최소 1개의 옵션이 필요합니다.');

        addNotice('최소 1개의 옵션이 필요합니다.', 'error');
        return prevValues; // 옵션 제거하지 않고 함수 종료
      }
      const nextValues = { ...prevValues };
      const nextQuestions = [...nextValues.questions];
      const targetQuestion = nextQuestions[questionIndex];
      if (!targetQuestion) return prevValues;
      const nextOptions = [...(targetQuestion.questionOptions || []).filter((opt) => opt.idx !== optionIdx)];
      nextQuestions[questionIndex] = { ...targetQuestion, questionOptions: nextOptions as IQuestionOption[] };
      nextValues.questions = nextQuestions;
      formik.setFieldError(`questions.${questionIndex}.questionOptions`, '');
      return nextValues;
    });
  }, []);

  const handlePreview = () => {
    setIsPreview(true);
  };

  const setFieldError = useCallback((field: string, value: string) => formik.setFieldError(field, value), []);
  const setFieldTouched = useCallback((field: string, value?: boolean) => formik.setFieldTouched(field, value), []);

  const handleChangeBy = useCallback((name: string, value: any) => {
    formik.setFieldValue(name, value);
  }, []);

  const handleChangeQuestionType = useCallback((questionIndex: number, field: string, value: any) => {
    formik.setValues((prevValues) => {
      const nextValues = { ...prevValues };
      const question = nextValues.questions[questionIndex] as IQuestion;
      if (field === 'questionType' && (value === QuestionType.SingleChoice || value === QuestionType.MultipleChoice)) {
        if (question.questionOptions?.length === 0) {
          question.questionOptions = [{ id: null, label: '', sequence: 0, idx: Date.now() }];
        }
        /* TODO: 추후 타입 변경할 지 고려 */
        /* 선택 질문은 무조건 Text 데이터 타입 */
      } else {
        question.questionOptions = [];
      }
      question.dataType = DataType.Text;
      // if (question[field as keyof IQuestion]) {
      //   // question[field] = value;
      // }
      Object.assign(question, { [field]: value });
      return nextValues;
    });
  }, []);

  const handleTemporarySave = useCallback(() => {
    if (id) {
      handleUpdateTemporarySurvey(id, formik.values);
    } else {
      handleSaveTemporarySurvey(formik.values);
    }
  }, [id, formik.values]);

  if (!user || user.role === UserRole.Viewer) {
    return <Loading />;
  }

  // --- RENDER ---
  return (
    <Container maxWidth="lg">
      <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 12 }}>
            <SurveyInformation
              title={formik.values.title}
              description={formik.values.description}
              expiresAt={formik.values.expiresAt}
              categories={categories?.payload || []}
              isPublic={formik.values.isPublic}
              status={formik.values.status}
              categoryId={formik.values.categoryId}
              handleChange={handleChangeBy}
              touchedTitle={formik.touched.title}
              touchedExpiresAt={formik.touched.expiresAt}
              touchedCategoryId={formik.touched.categoryId}
              errorsTitle={formik.errors.title}
              errorsExpiresAt={formik.errors.expiresAt}
              errorsCategoryId={formik.errors.categoryId}
            />

            {formik.values.questions.map((question, index) => (
              <QuestionCard
                key={question.idx}
                idx={question.idx}
                index={index}
                title={question.title}
                description={question.description}
                questionType={question.questionType}
                dataType={question.dataType}
                isRequired={question.isRequired}
                questionOptions={question.questionOptions}
                touched={formik.touched.questions?.[index]}
                errors={formik.errors.questions?.[index] as FormikErrors<Omit<AllQuestion, 'questionAnswers' | 'isAnswered'>> | undefined}
                handleChangeBy={handleChangeBy}
                handleChangeQuestionType={handleChangeQuestionType}
                handleAddOption={handleAddOption}
                handleRemoveQuestion={handleRemoveQuestion}
                handleRemoveOption={handleRemoveOption}
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
              <ActionButton
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
              </ActionButton>

              <Stack direction="row" spacing={2} alignItems="center">
                <ActionButton
                  variant="text"
                  onClick={handleTemporarySave}
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
                </ActionButton>

                <ActionButton
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
                </ActionButton>

                <ActionButton
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
                </ActionButton>
              </Stack>
            </Box>
          </Grid>

          <AddQuestionSheet onPick={(qType, dType) => handleAddQuestion(qType, dType)} isMobile={isMobile} />
        </Grid>
      </Box>

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
              questionAnswers: new Map(),
            })),
          }}
          handleClose={() => setIsPreview(false)}
        />
      )}
    </Container>
  );
};

export default Survey;
