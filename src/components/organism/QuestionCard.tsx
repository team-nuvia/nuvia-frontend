import { QUESTION_DEFAULT_TYPE_LIST } from '@common/global';
import ActionButton from '@components/atom/ActionButton';
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
import { InputType } from '@share/enums/input-type';
import { IQuestion, IQuestionOption } from '@share/interface/iquestion';
import { useFormikContext } from 'formik';
import { useMemo } from 'react';

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
  id: number;
  index: number;
  title: string;
  description: string;
  questionType: InputType;
  dataType: DataType;
  required: boolean;
  value?: string;
  options?: IQuestionOption[];
}

const QuestionCard: React.FC<QuestionCardProps> = ({ id, index, title, description, questionType, dataType, required, options }) => {
  const { setFieldValue, values } = useFormikContext<{
    questions: IQuestion[];
  }>();

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

  // Formik과 직접 연동된 핸들러들
  const handleQuestionChange = (field: keyof IQuestion, value: any) => {
    const questionIndex = values.questions.findIndex((q) => q.id === id);
    if (questionIndex !== -1) {
      const updatedQuestions = [...values.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        [field]: value,
      };
      setFieldValue('questions', updatedQuestions);
    }
  };

  const handleOptionChange = (optionId: number, value: string) => {
    const questionIndex = values.questions.findIndex((q) => q.id === id);
    if (questionIndex !== -1) {
      const updatedQuestions = [...values.questions];
      const question = updatedQuestions[questionIndex];
      const optionIndex = question.options?.findIndex((opt) => opt.id === optionId);

      if (optionIndex !== -1 && question.options) {
        question.options[optionIndex] = {
          ...question.options[optionIndex],
          label: value,
        };
        setFieldValue('questions', updatedQuestions);
      }
    }
  };

  const handleAddOption = () => {
    const questionIndex = values.questions.findIndex((q) => q.id === id);
    if (questionIndex !== -1) {
      const updatedQuestions = [...values.questions];
      const question = updatedQuestions[questionIndex];
      const newOption = { id: Date.now(), label: '' };

      updatedQuestions[questionIndex] = {
        ...question,
        options: [...(question.options || []), newOption],
      };
      setFieldValue('questions', updatedQuestions);
    }
  };

  const handleRemoveOption = (optionId: number) => {
    const questionIndex = values.questions.findIndex((q) => q.id === id);
    if (questionIndex !== -1) {
      const updatedQuestions = [...values.questions];
      const question = updatedQuestions[questionIndex];

      updatedQuestions[questionIndex] = {
        ...question,
        options: (question.options || []).filter((opt) => opt.id !== optionId),
      };
      setFieldValue('questions', updatedQuestions);
    }
  };

  const handleRemoveQuestion = () => {
    const filteredQuestions = values.questions.filter((q) => q.id !== id);
    setFieldValue('questions', filteredQuestions);
  };

  return (
    <Paper key={id} elevation={3} sx={{ p: 4, mt: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            size="small"
            label={`질문 ${index}`}
            value={title}
            onChange={(e) => handleQuestionChange('title', e.target.value)}
            variant="standard"
          />
          <ActionButton
            component={Chip}
            startIcon={<EditSquareIcon />}
            color={required ? 'error' : 'info'}
            variant="contained"
            onClick={() => handleQuestionChange('required', !required)}
            shape="rounded"
            size="small"
            sx={{ p: 0, fontSize: '0.8rem' }}
            label={required ? '필수' : '선택'}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Select
            fullWidth
            size="small"
            value={questionType || InputType.ShortText}
            onChange={(e) => handleQuestionChange('questionType', e.target.value as InputType)}
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
            value={description}
            onChange={(e) => handleQuestionChange('description', e.target.value)}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        {(questionType === InputType.SingleChoice || questionType === InputType.MultipleChoice) && (
          <Box>
            {(options || []).map((option, optIndex) => (
              <Grid container spacing={1} key={option.id} alignItems="center">
                <Grid size={{ xs: 11 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label={`옵션 ${optIndex + 1}`}
                    value={option.label}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    variant="standard"
                    type={inputValueType}
                  />
                </Grid>
                <Grid size={{ xs: 1 }}>
                  <IconButton onClick={() => handleRemoveOption(option.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button onClick={handleAddOption} sx={{ mt: 1 }}>
              옵션 추가
            </Button>
          </Box>
        )}
      </Box>

      <Stack direction="row" gap={1} mt={2} alignItems="center" justifyContent={questionType === InputType.ShortText ? 'space-between' : 'flex-end'}>
        {questionType === InputType.ShortText && (
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
