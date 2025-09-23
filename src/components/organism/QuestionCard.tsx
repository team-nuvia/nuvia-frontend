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
import { QuestionType } from '@share/enums/question-type';
import { AllQuestion, IQuestionOption } from '@share/interface/iquestion';
import { FormikErrors, FormikTouched } from 'formik';
import { memo, useMemo } from 'react';

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
  questionOptions?: IQuestionOption[];
  touched?: FormikTouched<Omit<AllQuestion, 'questionAnswers' | 'isAnswered'>>;
  errors?: FormikErrors<Omit<AllQuestion, 'questionAnswers' | 'isAnswered'>>;
  handleChangeBy: (name: string, value: any) => void;
  handleChangeQuestionType: (questionIndex: number, field: string, value: any) => void;
  handleAddOption: (questionIndex: number) => void;
  handleRemoveQuestion: (questionIndex: number) => void;
  handleRemoveOption: (questionIndex: number, optionIdx: number | string) => void;
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
  touched,
  errors,
  handleChangeBy,
  handleChangeQuestionType,
  handleAddOption,
  handleRemoveQuestion,
  handleRemoveOption,
}) => {
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

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            name={`questions.${index}.title`}
            fullWidth
            size="small"
            label={`질문 ${index + 1}`}
            value={title}
            onChange={(e) => handleChangeBy(`questions.${index}.title`, e.target.value)}
            variant="standard"
            error={touched?.title && Boolean(errors?.title)}
            helperText={touched?.title && errors?.title}
            required
          />
          <ActionButton
            component={Chip}
            startIcon={<EditSquareIcon />}
            color={isRequired ? 'error' : 'info'}
            variant="contained"
            onClick={() => handleChangeBy(`questions.${index}.isRequired`, !isRequired)}
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
            name={`questions.${index}.questionType`}
            value={questionType || QuestionType.ShortText}
            onChange={(e) => handleChangeQuestionType(index, 'questionType', e.target.value as QuestionType)}
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
            name={`questions.${index}.description`}
            fullWidth
            multiline
            rows={3}
            label="설문 설명"
            value={description ?? ''}
            onChange={(e) => handleChangeBy(`questions.${index}.description`, e.target.value)}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        {(questionType === QuestionType.SingleChoice || questionType === QuestionType.MultipleChoice) && (
          <Box>
            {(questionOptions || []).map((option, optIndex) => {
              const touchedOption = touched?.questionOptions?.[optIndex] as FormikTouched<IQuestionOption> | undefined;
              const errorsOption = errors?.questionOptions?.[optIndex] as FormikErrors<IQuestionOption> | undefined;
              return (
                <Grid container spacing={1} key={idx + '-' + option.idx} alignItems="center">
                  <Grid size={{ xs: 11 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label={`옵션 ${optIndex + 1}`}
                      value={option.label}
                      name={`questions.${index}.questionOptions.${optIndex}.label`}
                      onChange={(e) => handleChangeBy(`questions.${index}.questionOptions.${optIndex}.label`, e.target.value)}
                      variant="standard"
                      type={inputValueType}
                      error={touchedOption?.label && Boolean(errorsOption?.label)}
                      helperText={touchedOption?.label && errorsOption?.label}
                      required
                      autoFocus={questionOptions?.length === optIndex + 1}
                    />
                  </Grid>
                  <Grid size={{ xs: 1 }}>
                    <IconButton onClick={() => handleRemoveOption(index, option.idx)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              );
            })}
            <Button onClick={() => handleAddOption(index)} sx={{ mt: 1 }}>
              옵션 추가
            </Button>
            {/* {questionOptions?.length === 0 && questionTouched && (
              <Box sx={{ color: 'error.main', fontSize: '0.75rem', mb: 1 }}>최소 1개의 옵션이 필요합니다.</Box>
            )} */}
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
            <RadioGroup row value={dataType} onChange={(e) => handleChangeBy(`questions.${index}.dataType`, e.target.value as DataType)}>
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
        <IconButton onClick={() => handleRemoveQuestion(index)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
};

export default memo(QuestionCard);
