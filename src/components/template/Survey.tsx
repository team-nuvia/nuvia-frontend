'use client';

import { QUESTION_DATA_TYPE_MAP, QUESTION_TYPE_ICONS, QUESTION_TYPE_MAP } from '@common/global';
import Preview from '@components/organism/Preview';
import QuestionCard from '@components/organism/QuestionCard';
import LoadingContext from '@context/LodingContext';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import {
  Alert,
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
  Snackbar,
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
import { AllQuestion, IQuestion } from '@share/interface/iquestion';
import axios from 'axios';
import dayjs from 'dayjs';
import { useContext, useLayoutEffect, useState } from 'react';

// --- HELPER FUNCTIONS ---
const generatePassword = () => Math.random().toString(36).slice(-8);

// --- COMPONENT ---
const Survey: React.FC = () => {
  const { endLoading } = useContext(LoadingContext);
  // --- STATE ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [questions, setQuestions] = useState<AllQuestion[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  useLayoutEffect(() => {
    endLoading();
  }, []);

  // --- HANDLERS ---
  const handleAddQuestion = (questionType: InputType, dataType?: DataType) => {
    const newQuestion: AllQuestion = {
      id: Date.now(),
      title: '',
      description: '',
      questionType,
      dataType: dataType || DataType.Text,
      required: false,
      isAnswered: false,
      options: [{ id: 1, label: '' }],
      answers: new Map(),
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleQuestionChange = (id: number, field: keyof IQuestion, value: any) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const handleRemoveQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleAddOption = (questionId: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOption = { id: Date.now(), label: '' };
          return { ...q, options: [...(q.options || []), newOption] };
        }
        return q;
      }),
    );
  };

  const handleOptionChange = (questionId: number, optionId: number, label: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: (q.options || []).map((opt) => (opt.id === optionId ? { ...opt, label } : opt)),
          };
        }
        return q;
      }),
    );
  };

  const handleRemoveOption = (questionId: number, optionId: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: (q.options || []).filter((opt) => opt.id !== optionId),
          };
        }
        return q;
      }),
    );
  };

  const handlePreview = () => {
    setIsPreview(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // NOTE: Assuming non-member survey for now. Auth state would determine this.
    const isMember = false;
    const managementPassword = isMember ? '' : generatePassword();

    const surveyData = {
      title,
      description,
      expires_at: expiresAt,
      is_public: isPublic,
      questions: questions.map(({ id, ...rest }) => ({
        ...rest,
        options: (rest.options || []).map(({ id, ...optRest }) => optRest), // Remove client-side IDs
      })),
      management_password: managementPassword,
    };

    try {
      // Using a placeholder API endpoint
      const response = await axios.post('/api/nuvia/surveys', surveyData);

      if (response.status === 201) {
        let successMessage = '설문이 성공적으로 생성되었습니다!';
        if (managementPassword) {
          successMessage += ` 관리용 비밀번호: ${managementPassword}`;
        }
        setSuccess(successMessage);
        // Reset form
        setTitle('');
        setDescription('');
        setExpiresAt(null);
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

  const reversedQuestionTypes = Object.entries(QUESTION_TYPE_MAP).toReversed();

  // --- RENDER ---
  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: isMobile ? 12 : 8 }}>
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" gutterBottom>
              설문 제작
            </Typography>
            <Box component="form" noValidate autoComplete="off">
              <TextField fullWidth label="설문 제목" value={title} onChange={(e) => setTitle(e.target.value)} margin="dense" required />
              <TextField
                fullWidth
                label="설문 설명 (선택)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                margin="dense"
                multiline
                rows={3}
              />
              <DateTimePicker
                label="만료일 (선택)"
                value={expiresAt ? dayjs(expiresAt) : null}
                onChange={(value) => setExpiresAt(value?.toISOString() || null)}
                format="YYYY-MM-DD HH:mm"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'dense',
                  },
                }}
              />
              <FormControlLabel control={<Switch checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />} label="응답 공개 여부" />
            </Box>
          </Paper>

          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              id={question.id}
              index={index + 1}
              title={question.title}
              description={question.description}
              questionType={question.questionType}
              dataType={question.dataType}
              required={question.required}
              options={question.options}
              handleQuestionChange={handleQuestionChange}
              handleOptionChange={handleOptionChange}
              handleRemoveOption={handleRemoveOption}
              handleAddOption={handleAddOption}
              handleRemoveQuestion={handleRemoveQuestion}
            />
          ))}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={() => handleAddQuestion(InputType.ShortText)}>
              질문 추가
            </Button>
            <Stack direction="row" gap={2} alignItems="center">
              <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={handlePreview} disabled={isSubmitting}>
                미리보기
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />} color="primary" onClick={handleSubmit} disabled={isSubmitting}>
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
                  handleAddQuestion(QUESTION_DATA_TYPE_MAP[key as InputType | DataType].key, QUESTION_DATA_TYPE_MAP[key as InputType | DataType].type)
                }
              />
            ))}
        </SpeedDial>
      )}

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

      {isPreview && (
        <Preview
          survey={{
            title,
            name: '',
            description,
            category: '',
            expiresAt: expiresAt || '',
            isPublic,
            participants: 0,
            questions,
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
