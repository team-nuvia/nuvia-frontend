import { QUESTION_DEFAULT_TYPE_LIST } from '@common/global';
import ActionButton from '@components/atom/ActionButton';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { IQuestion, IQuestionOption } from '@share/interface/iquestion';
import { useContext, useMemo } from 'react';

const DATA_TYPE_MAP = {
  [DataType.Text]: '텍스트',
  [DataType.Image]: '이미지',
  [DataType.Video]: '비디오',
  [DataType.File]: '파일',
  [DataType.Location]: '위치',
  [DataType.Rating]: '평점',
  [DataType.Date]: '날짜',
  [DataType.DateTime]: '날짜/시간',
  [DataType.Time]: '시간',
  [DataType.Email]: '이메일',
  [DataType.Link]: '링크',
};

interface QuestionCardProps {
  idx: number;
  index: number;
  title: string;
  description: string | null;
  questionType: QuestionType;
  dataType: DataType;
  isRequired: boolean;
  value?: string;
  questionOptions?: IQuestionOption[];
  questions: Omit<IQuestion, 'answers' | 'isAnswered'>[];
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, message: string) => void;
  setFieldTouched: (field: string, touched?: boolean) => void;
  touched?: { [key: string]: { [key: string]: boolean } };
  errors?: { [key: string]: { [key: string]: any } };
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  idx,
  index,
  title,
  description,
  questionType,
  dataType,
  isRequired,
  questionOptions,
  questions,
  setFieldValue,
  setFieldError,
  setFieldTouched,
  touched,
  errors,
}) => {
  const { handleOpenDialog } = useContext(GlobalDialogContext);
  const { addNotice } = useContext(GlobalSnackbarContext);
  const inputValueType = useMemo(() => {
    switch (dataType) {
      case DataType.Image:
        return 'file';
      case DataType.Video:
        return 'file';
      case DataType.File:
        return 'file';
      case DataType.Location:
        return 'text';
      case DataType.Rating:
        return 'number';
      case DataType.Date:
        return 'date';
      case DataType.Time:
        return 'time';
      case DataType.DateTime:
        return 'datetime-local';
      case DataType.Email:
        return 'email';
      case DataType.Text:
      default:
        return 'text';
    }
  }, [dataType]);

  // 현재 질문의 validation 상태
  const questionIndex = questions.findIndex((q) => q.idx === idx);
  const questionTouched = touched?.questions?.[questionIndex] || false;
  const questionErrors = errors?.questions?.[questionIndex] || {};
  const titleError = questionErrors.title;
  const optionsErrors = questionErrors.options || [];

  // Formik과 직접 연동된 핸들러들
  const handleQuestionChange = (field: keyof IQuestion, value: any) => {
    if (questionIndex !== -1) {
      const updatedQuestions = [...questions];
      const updateData: Partial<IQuestion> = {};

      if (field === 'questionType') {
        const isSelectable = value === QuestionType.SingleChoice || value === QuestionType.MultipleChoice;
        Object.assign(updateData, {
          dataType: DataType.Text,
          questionOptions: isSelectable ? [{ id: null, label: '' }] : [],
        });
      }

      updateData[field] = value;

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        ...updateData,
      };
      setFieldValue('questions', updatedQuestions);
    }
  };

  const handleOptionChange = (optionIdx: number | string, value: string) => {
    if (questionIndex !== -1) {
      const updatedQuestions = [...questions];
      const question = updatedQuestions[questionIndex];
      const optionIndex = question.questionOptions?.findIndex((opt) => opt.idx === optionIdx);

      if (optionIndex !== -1 && question.questionOptions) {
        question.questionOptions[optionIndex] = {
          ...question.questionOptions[optionIndex],
          label: value,
        };
        setFieldValue('questions', updatedQuestions);
      }
    }
  };

  const handleAddOption = () => {
    if (questionIndex !== -1) {
      const updatedQuestions = [...questions];
      const question = updatedQuestions[questionIndex];
      const newOption = { id: null, label: '', sequence: question.questionOptions?.length || 0, idx: Date.now() };

      updatedQuestions[questionIndex] = {
        ...question,
        questionOptions: [...(question.questionOptions || []), newOption],
      };
      setFieldValue('questions', updatedQuestions);
    }
  };

  const handleRemoveOption = (optionIdx: number | string) => {
    if (questions[questionIndex].questionOptions?.length === 1) {
      // 해당 질문의 options 필드를 touched로 설정
      setFieldTouched(`questions.${questionIndex}.questionOptions`, true);
      // 에러 메시지 설정
      setFieldError(`questions.${questionIndex}.questionOptions`, '최소 1개의 옵션이 필요합니다.');

      addNotice('최소 1개의 옵션이 필요합니다.', 'error');
      return; // 옵션 제거하지 않고 함수 종료
    }

    if (questionIndex !== -1) {
      const updatedQuestions = [...questions];
      const question = updatedQuestions[questionIndex];

      updatedQuestions[questionIndex] = {
        ...question,
        questionOptions: (question.questionOptions || []).filter((opt) => opt.idx !== optionIdx),
      };
      setFieldValue('questions', updatedQuestions);

      // 옵션 제거 후 에러가 있었다면 클리어
      setFieldError(`questions.${questionIndex}.questionOptions`, '');
    }
  };

  const handleRemoveQuestion = () => {
    if (questions.length === 1) {
      addNotice('최소 1개의 질문이 필요합니다.', 'error');
      return;
    }
    handleOpenDialog({
      title: '질문 삭제',
      content: '삭제된 질문은 복구 불가합니다. 삭제하시겠습니까?',
      actionCallback: confirmRemoveQuestion,
      useConfirm: true,
    });
  };

  const confirmRemoveQuestion = () => {
    const filteredQuestions = questions.filter((q) => q.idx !== idx);
    setFieldValue('questions', filteredQuestions);
    addNotice('질문이 삭제되었습니다', 'success');
  };

  return (
    <Paper key={idx} elevation={3} sx={{ p: 4, mt: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            size="small"
            label={`질문 ${index}`}
            value={title}
            onChange={(e) => handleQuestionChange('title', e.target.value)}
            variant="standard"
            error={questionTouched && Boolean(titleError)}
            helperText={questionTouched && titleError}
            required
          />
          <ActionButton
            component={Chip}
            startIcon={<EditSquareIcon />}
            color={isRequired ? 'error' : 'info'}
            variant="contained"
            onClick={() => handleQuestionChange('isRequired', !isRequired)}
            shape="rounded"
            size="small"
            sx={{ p: 0, fontSize: '0.8rem' }}
            label={isRequired ? '필수' : '선택'}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Select
            fullWidth
            size="small"
            value={questionType || QuestionType.ShortText}
            onChange={(e) => handleQuestionChange('questionType', e.target.value as QuestionType)}
          >
            {Object.entries(QUESTION_DEFAULT_TYPE_LIST).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="설문 설명"
            value={description ?? ''}
            onChange={(e) => handleQuestionChange('description', e.target.value)}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        {(questionType === QuestionType.SingleChoice || questionType === QuestionType.MultipleChoice) && (
          <Box>
            {/* 옵션 에러 메시지 표시 */}
            {/* {questionTouched && questionErrors?.options && (
              <Box sx={{ color: 'error.main', fontSize: '0.75rem', mb: 1 }}>{questionErrors?.options}</Box>
            )} */}

            {(questionOptions || []).map((option, optIndex) => (
              <Grid container spacing={1} key={option.idx} alignItems="center">
                <Grid size={{ xs: 11 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label={`옵션 ${optIndex + 1}`}
                    value={option.label}
                    onChange={(e) => handleOptionChange(option.idx, e.target.value)}
                    variant="standard"
                    type={inputValueType}
                    error={questionTouched && Boolean(optionsErrors[optIndex]?.label)}
                    helperText={questionTouched && optionsErrors[optIndex]?.label}
                    required
                    autoFocus={questionOptions?.length === optIndex + 1}
                  />
                </Grid>
                <Grid size={{ xs: 1 }}>
                  <IconButton onClick={() => handleRemoveOption(option.idx)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button onClick={handleAddOption} sx={{ mt: 1 }}>
              옵션 추가
            </Button>
            {questionOptions?.length === 0 && questionTouched && (
              <Box sx={{ color: 'error.main', fontSize: '0.75rem', mb: 1 }}>최소 1개의 옵션이 필요합니다.</Box>
            )}
          </Box>
        )}
      </Box>

      <Stack
        direction="row"
        gap={1}
        mt={2}
        alignItems="center"
        justifyContent={questionType === QuestionType.ShortText ? 'space-between' : 'flex-end'}
      >
        {questionType === QuestionType.ShortText && (
          <FormControl>
            <RadioGroup row value={dataType} onChange={(e) => handleQuestionChange('dataType', e.target.value as DataType)}>
              {Object.values(DataType).map((value) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio size="small" />}
                  label={DATA_TYPE_MAP[value]}
                  slotProps={{
                    typography: {
                      variant: 'caption',
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}
        <IconButton onClick={handleRemoveQuestion}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
};

export default QuestionCard;
