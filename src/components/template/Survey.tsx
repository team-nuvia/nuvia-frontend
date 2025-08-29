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
import LoadingContext from '@context/LodingContext';
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
import { useQuery } from '@tanstack/react-query';
import { LocalizationManager } from '@util/LocalizationManager';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
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
  const { endLoading } = useContext(LoadingContext);
  const { addNotice } = useContext(GlobalSnackbarContext);
  const router = useRouter();
  const theme = useTheme();
  const { isLoading: isUserLoading, isVerified, user } = useContext(AuthenticationContext);

  /* state */
  const SUBMIT_BUTTON_TEXT = id ? '설문 수정' : '설문 저장';
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: categories } = useQuery<ServerResponse<ICategory[]>>({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });
  const { data: surveyData } = useQuery<ServerResponse<GetSurveyDetailResponse>>({
    queryKey: ['survey', id],
    queryFn: () => getSurveyDetail(id as string),
    enabled: !!id,
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

  useLayoutEffect(() => {
    if (isVerified && surveyData?.payload) {
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
      endLoading();
    } else {
      endLoading();
    }
  }, [surveyData]);

  useEffect(() => {
    if (!isUserLoading) {
      if (isVerified && user && user.role === UserRole.Viewer) {
        router.push('/survey');
      }
    }
  }, [isUserLoading, isVerified, user]);

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

    try {
      // Using a placeholder API endpoint
      const response = await createSurvey(surveyData as CreateSurveyPayload);

      if (response.ok) {
        addNotice((response.reason as string) || response.message, 'success');
        // Reset form
        router.push('/survey');
      } else {
        addNotice((response.reason as string) || response.message, 'error');
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

  if (isUserLoading || !user || user.role === UserRole.Viewer) {
    return <Loading />;
  }

  // --- RENDER ---
  return (
    <Container maxWidth="lg">
      <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
              <Typography variant="h4" gutterBottom>
                설문 제작
              </Typography>
              <Box>
                <TextField
                  fullWidth
                  label="설문 제목"
                  margin="dense"
                  required
                  {...formik.getFieldProps('title')}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />

                <TextField
                  fullWidth
                  label="설문 설명 (선택)"
                  margin="dense"
                  multiline
                  rows={3}
                  {...formik.getFieldProps('description')}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />

                <DateTimePicker
                  label="만료일 (선택)"
                  value={formik.values.expiresAt ? dayjs(formik.values.expiresAt) : null}
                  onChange={(value) => formik.setFieldValue('expiresAt', value?.toISOString() || null)}
                  format="YYYY-MM-DD HH:mm"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: 'dense',
                      error: formik.touched.expiresAt && Boolean(formik.errors.expiresAt),
                      helperText: formik.touched.expiresAt && formik.errors.expiresAt,
                    },
                  }}
                />

                <FormControlLabel
                  control={<Switch checked={formik.values.isPublic} onChange={formik.handleChange} name="isPublic" />}
                  label="응답 공개 여부"
                />

                <RadioGroup
                  row
                  aria-labelledby="status-radio-buttons-group-label"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel value={SurveyStatus.Draft} control={<Radio />} label={LocalizationManager.translate(SurveyStatus.Draft)} />
                  <FormControlLabel value={SurveyStatus.Active} control={<Radio />} label={LocalizationManager.translate(SurveyStatus.Active)} />
                  <FormControlLabel value={SurveyStatus.Closed} control={<Radio />} label={LocalizationManager.translate(SurveyStatus.Closed)} />
                </RadioGroup>

                <Select
                  fullWidth
                  label="카테고리 (선택)"
                  margin="dense"
                  {...formik.getFieldProps('categoryId')}
                  defaultValue=""
                  error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                >
                  <MenuItem value="">선택해주세요</MenuItem>
                  {categories?.payload?.map((category) => (
                    <MenuItem key={category.id.toString()} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.categoryId && formik.errors.categoryId && <FormHelperText error>{formik.errors.categoryId}</FormHelperText>}
              </Box>
            </Paper>

            {formik.values.questions.map((question, index) => (
              <QuestionCard
                key={question.idx}
                idx={question.idx}
                index={index + 1}
                title={question.title}
                description={question.description ?? ''}
                questionType={question.questionType}
                dataType={question.dataType}
                isRequired={question.isRequired}
                questionOptions={question.questionOptions}
                questions={formik.values.questions}
                setFieldValue={formik.setFieldValue}
                setFieldError={formik.setFieldError}
                setFieldTouched={formik.setFieldTouched}
                touched={formik.touched as { [key: string]: { [key: string]: boolean } }}
                errors={formik.errors as { [key: string]: { [key: string]: any } }}
              />
            ))}

            <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={() => handleAddQuestion(QuestionType.ShortText)}>
                질문 추가
              </Button>
              <Stack direction="row" gap={2} alignItems="center">
                <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={handlePreview} disabled={isSubmitting}>
                  미리보기
                </Button>
                <Button type="submit" variant="contained" startIcon={<SaveIcon />} color="primary" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} /> : SUBMIT_BUTTON_TEXT}
                </Button>
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
            })),
          }}
          handleClose={() => setIsPreview(false)}
        />
      )}
    </Container>
  );
};

export default Survey;
