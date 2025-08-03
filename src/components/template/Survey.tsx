'use client';

import { CreateSurveyPayload } from '@/models/CreateSurveyPayload';
import { createSurvey } from '@api/create-survey';
import { QUESTION_DATA_TYPE_MAP, QUESTION_TYPE_ICONS, QUESTION_TYPE_MAP } from '@common/global';
import Preview from '@components/organism/Preview';
import QuestionCard from '@components/organism/QuestionCard';
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
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DataType } from '@share/enums/data-type';
import { InputType } from '@share/enums/input-type';
import { AllQuestion } from '@share/interface/iquestion';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import * as Yup from 'yup';

// --- HELPER FUNCTIONS ---
const generatePassword = () => Math.random().toString(36).slice(-8);

// --- VALIDATION SCHEMA ---
const SurveySchema = Yup.object().shape({
  title: Yup.string().required('설문 제목은 필수입니다.'),
  description: Yup.string(),
  expiresAt: Yup.string().nullable(),
  isPublic: Yup.boolean().required(),
  questions: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().required(),
      title: Yup.string().required('질문 제목은 필수입니다.'),
      description: Yup.string(),
      inputType: Yup.string().required(),
      dataType: Yup.string().required(),
      isRequired: Yup.boolean().required(),
      // isAnswered: Yup.boolean().required(),
      options: Yup.array().of(
        Yup.object().shape({
          id: Yup.number().required(),
          label: Yup.string().required('옵션 라벨은 필수입니다.'),
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
  expiresAt: null as Date | null,
  isPublic: true,
  questions: [] as AllQuestion[],
};

// --- COMPONENT ---
const Survey: React.FC = () => {
  /* hooks */
  const { endLoading } = useContext(LoadingContext);
  const { addNotice } = useContext(GlobalSnackbarContext);
  const router = useRouter();
  const theme = useTheme();

  /* state */
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useLayoutEffect(() => {
    endLoading();
  }, []);

  // --- FORMIK ---
  const formik = useFormik({
    initialValues,
    validationSchema: SurveySchema,
    onSubmit: async (values) => {
      for (let i = 0; i < values.questions.length; i++) {
        const question = values.questions[i];
        if ((question.inputType === InputType.SingleChoice || question.inputType === InputType.MultipleChoice) && question.options?.length === 0) {
          formik.setFieldTouched(`questions[${i}].options`, true);
          formik.setFieldError(`questions[${i}].options`, '최소 1개의 옵션이 필요합니다.');
          return;
        }
      }

      setIsSubmitting(true);

      const surveyData: CreateSurveyPayload = {
        title: values.title,
        description: values.description,
        expiresAt: values.expiresAt || null,
        isPublic: values.isPublic,
        questions: values.questions.map(({ id, ...rest }) => ({
          ...rest,
          options: (rest.options || []).map(({ id, ...optRest }) => optRest), // Remove client-side IDs
        })),
        // managementPassword: managementPassword,
      };

      try {
        // Using a placeholder API endpoint
        const response = await createSurvey(surveyData);

        if (response.ok) {
          addNotice('설문이 성공적으로 생성되었습니다!', 'success');
          // Reset form
          formik.resetForm();
        } else {
          addNotice(response.message, 'error');
        }
      } catch (err) {
        console.error(err);
        addNotice('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
      } finally {
        setIsSubmitting(false);
        router.push('/');
      }
    },
  });

  useEffect(() => {
    if (formik.isSubmitting && Object.keys(formik.errors).length > 0) {
      console.log(formik.errors);
      addNotice('설문에 필요한 내용을 작성해주세요.', 'warning');
    }
  }, [formik.errors, formik.touched]);

  // --- HANDLERS ---
  const handleAddQuestion = (inputType: InputType, dataType?: DataType) => {
    const isSelectable = inputType === InputType.SingleChoice || inputType === InputType.MultipleChoice;
    const newQuestion: Omit<AllQuestion, 'answers'> = {
      id: Date.now(),
      title: '',
      description: '',
      inputType,
      dataType: dataType || DataType.Text,
      isRequired: false,
      // isAnswered: false,
      options: isSelectable ? [{ id: Date.now(), label: '' }] : [],
      // answers: new Map(),
    };
    formik.setFieldValue('questions', [...formik.values.questions, newQuestion]);
  };

  const handlePreview = () => {
    setIsPreview(true);
  };

  const reversedQuestionTypes = Object.entries(QUESTION_TYPE_MAP).toReversed();

  // --- RENDER ---
  return (
    <Container maxWidth="lg">
      <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: isMobile ? 12 : 8 }}>
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
              </Box>
            </Paper>

            {formik.values.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                id={question.id}
                index={index + 1}
                title={question.title}
                description={question.description}
                inputType={question.inputType}
                dataType={question.dataType}
                isRequired={question.isRequired}
                options={question.options}
                questions={formik.values.questions}
                setFieldValue={formik.setFieldValue}
                setFieldError={formik.setFieldError}
                setFieldTouched={formik.setFieldTouched}
                touched={formik.touched as { [key: string]: { [key: string]: boolean } }}
                errors={formik.errors as { [key: string]: { [key: string]: any } }}
              />
            ))}

            <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={() => handleAddQuestion(InputType.ShortText)}>
                질문 추가
              </Button>
              <Stack direction="row" gap={2} alignItems="center">
                <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={handlePreview} disabled={isSubmitting}>
                  미리보기
                </Button>
                <Button type="submit" variant="contained" startIcon={<SaveIcon />} color="primary" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} /> : '설문 저장'}
                </Button>
              </Stack>
            </Box>
          </Grid>

          {!isMobile && (
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={3} sx={{ p: 2, mt: 4, position: 'sticky', top: 20 }}>
                <Typography variant="h6" gutterBottom>
                  질문 유형
                </Typography>
                <List sx={{ maxHeight: '500px', overflow: 'auto' }}>
                  {Object.entries(QUESTION_TYPE_MAP).map(([key, value]) => (
                    <ListItem
                      key={key}
                      disablePadding
                      onClick={() =>
                        handleAddQuestion(
                          QUESTION_DATA_TYPE_MAP[key as InputType | DataType].key,
                          QUESTION_DATA_TYPE_MAP[key as InputType | DataType].type,
                        )
                      }
                    >
                      <ListItemButton>
                        <ListItemIcon>{QUESTION_TYPE_ICONS[key as InputType]}</ListItemIcon>
                        <ListItemText primary={value} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>

        {isMobile && (
          <SpeedDial ariaLabel="Add Question Speed Dial" sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<SpeedDialIcon />}>
            {Object.entries(QUESTION_TYPE_ICONS)
              .toReversed()
              .map(([key, icon]) => (
                <SpeedDialAction
                  key={key}
                  icon={icon}
                  slotProps={{
                    tooltip: { title: QUESTION_TYPE_MAP[key as InputType] },
                  }}
                  onClick={() =>
                    handleAddQuestion(
                      QUESTION_DATA_TYPE_MAP[key as InputType | DataType].key,
                      QUESTION_DATA_TYPE_MAP[key as InputType | DataType].type,
                    )
                  }
                />
              ))}
          </SpeedDial>
        )}
      </Box>

      {isPreview && (
        <Preview
          survey={{
            title: formik.values.title,
            name: '미리보기 사용자',
            description: formik.values.description,
            category: '미리보기',
            expiresAt: formik.values.expiresAt || null,
            isPublic: formik.values.isPublic,
            participants: 0,
            questions: formik.values.questions,
            createdAt: new Date(),
            updatedAt: new Date(),
          }}
          handleClose={() => setIsPreview(false)}
        />
      )}
    </Container>
  );
};

export default Survey;
