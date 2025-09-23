import CommonText from '@components/atom/CommonText';
import { Box, Checkbox, Chip, FormControl, FormControlLabel, FormGroup, Grid, Radio, RadioGroup, Rating, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { IQuestionOption } from '@share/interface/iquestion';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useMemo } from 'react';

// const DATA_TYPE_MAP = {
//   [DataType.Text]: '텍스트',
//   [DataType.Image]: '이미지',
//   [DataType.Video]: '비디오',
//   [DataType.File]: '파일',
//   [DataType.Location]: '위치',
//   [DataType.Rating]: '평점',
//   [DataType.Date]: '날짜',
//   [DataType.DateTime]: '날짜/시간',
//   [DataType.Time]: '시간',
//   [DataType.Email]: '이메일',
//   [DataType.Link]: '링크',
// };

interface ResponseCardProps {
  id: number | null;
  idx: number;
  index: number;
  title: string;
  description: string | null;
  questionType: QuestionType;
  dataType: DataType;
  isRequired: boolean;
  answers: Map<number, { optionId: number | null; value: string | number | null }>;
  questionOptions?: IQuestionOption[];
  handleOptionChange: (questionId: number, optionId: number, value: any) => void;
  // handleOptionClear: () => void;
}
const ResponseCard: React.FC<ResponseCardProps> = ({
  id,
  idx,
  index,
  title,
  description,
  questionType,
  dataType,
  isRequired,
  answers,
  questionOptions,
  handleOptionChange,
  // handleOptionClear,
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

  const dynamicField = (dataType: DataType, answers: Map<number, any>) => {
    if (dataType === DataType.Rating) {
      /* 설문 응답할 때 처리 */
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Rating
            size="large"
            value={answers.get(1) ? Number(answers.get(1)?.value) : 0}
            onChange={(_, value) => handleOptionChange(idx, 1, value || 0)}
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
            <CommonText variant="caption" color="text.secondary">
              매우 불만족
            </CommonText>
            <CommonText variant="caption" color="text.secondary">
              매우 만족
            </CommonText>
          </Box>
        </Box>
      );
    }
    if (dataType === DataType.Email) {
      return (
        <TextField
          fullWidth
          size="small"
          label="이메일"
          type="email"
          value={answers?.get(1)?.value ?? ''}
          onChange={(e) => handleOptionChange(idx, 1, e.target.value)}
        />
      );
    }
    if (dataType === DataType.Link) {
      return (
        <TextField
          fullWidth
          size="small"
          label="링크"
          type="url"
          value={answers?.get(1)?.value ?? ''}
          onChange={(e) => handleOptionChange(idx, 1, e.target.value)}
        />
      );
    }
    if (dataType === DataType.Date) {
      return (
        <DatePicker
          label="날짜"
          value={dayjs(answers?.get(1)?.value)}
          onChange={(e) => handleOptionChange(idx, 1, e?.toISOString() || '')}
          slotProps={{
            textField: {
              size: 'small',
            },
          }}
        />
      );
    }
    if (dataType === DataType.DateTime) {
      return (
        <DateTimePicker
          label="날짜/시간"
          value={dayjs(answers?.get(1)?.value)}
          onChange={(e) => handleOptionChange(idx, 1, e?.toISOString() || '')}
          // onChange={(e) => handleQuestionChange(id, 'value', e?.toISOString())}
          slotProps={{
            textField: {
              size: 'small',
            },
          }}
        />
      );
    }
    if (dataType === DataType.Time) {
      return (
        <TimePicker
          label="시간"
          value={dayjs(answers?.get(1)?.value)}
          onChange={(e) => handleOptionChange(idx, 1, e?.toISOString() || '')}
          // onChange={(e) => handleQuestionChange(id, 'value', e?.toISOString())}
          slotProps={{
            textField: {
              size: 'small',
            },
          }}
        />
      );
    }
    if (dataType === DataType.File) {
      /* 설문 응답할 때 처리 */
      return (
        <TextField
          fullWidth
          size="small"
          label="파일"
          type="file"
          value={answers?.get(1)?.value}
          onChange={(e) => handleOptionChange(idx, 1, e.target.value)}
          // onChange={(e) => handleQuestionChange(id, 'value', e.target.value)}
        />
      );
    }
    if (dataType === DataType.Image) {
      /* 설문 응답할 때 처리 */
      return (
        <TextField
          fullWidth
          size="small"
          label="이미지"
          type="file"
          slotProps={{
            htmlInput: {
              accept: 'image/*',
            },
          }}
          value={answers?.get(1)?.value}
          onChange={(e) => handleOptionChange(idx, 1, e.target.value)}
          // onChange={(e) => handleQuestionChange(id, 'value', e.target.value)}
        />
      );
    }
    if (dataType === DataType.Video) {
      /* 설문 응답할 때 처리 */
      return (
        <TextField
          fullWidth
          size="small"
          label="비디오"
          type="file"
          slotProps={{
            htmlInput: {
              accept: 'video/*',
            },
          }}
          value={answers?.get(1)?.value}
          onChange={(e) => handleOptionChange(idx, 1, e.target.value)}
          // onChange={(e) => handleQuestionChange(id, 'value', e.target.value)}
        />
      );
    }
    if (dataType === DataType.Location) {
      /* 설문 응답할 때 처리 */
      // return (
      //   <CommonText variant="caption" color="error">
      //     설문응답 시 표시됩니다.
      //   </CommonText>
      // );
      return;
    }
    return (
      <TextField
        fullWidth
        size="small"
        label="단답형 답변"
        type={inputValueType}
        value={answers?.get(1)?.value ?? ''}
        onChange={(e) => {
          handleOptionChange(idx, 1, e.target.value);
        }}
      />
    );
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid
          size={{ xs: 12 }}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <CommonText variant="h6">{`${index}. ${title}`}</CommonText>

          <Stack direction="row" alignItems="center" gap={2}>
            <Chip
              size="small"
              color={questionType === QuestionType.MultipleChoice ? 'primary' : 'default'}
              label={questionType === QuestionType.MultipleChoice ? '다중' : '단일'}
            />
            <Chip size="small" color={isRequired ? 'error' : 'default'} label={isRequired ? '필수' : '선택'} />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <CommonText variant="body2">{description}</CommonText>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        {questionType === QuestionType.ShortText && dynamicField(dataType, answers)}
        {questionType === QuestionType.LongText && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="장문형 답변"
            type={inputValueType}
            {...(dataType === DataType.Rating && {
              slotProps: { htmlInput: { min: 0, max: 5, step: 1 } },
            })}
            value={answers?.get(1)?.value ?? ''}
            onChange={(e) => handleOptionChange(idx, 1, e.target.value)}
          />
        )}
        {questionType === QuestionType.SingleChoice && (
          <FormControl component="fieldset" fullWidth /* error={hasError} */>
            <RadioGroup value={answers?.get(1)?.optionId || ''} onChange={(e) => handleOptionChange(idx, 1, e.target.value)}>
              {questionOptions?.map((option) => (
                <FormControlLabel
                  key={option.id || 'idx' + option.idx}
                  value={option.id}
                  control={<Radio />}
                  label={option.label}
                  sx={{
                    mb: 1,
                    p: 2,
                    border: '1px solid',
                    borderColor: answers?.get(1)?.optionId === option.id ? 'primary.main' : 'divider',
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
        )}
        {questionType === QuestionType.MultipleChoice && (
          <FormControl component="fieldset" fullWidth /* error={hasError} */>
            <FormGroup>
              {questionOptions?.map((option) => (
                <FormControlLabel
                  key={option.id || 'idx' + option.idx}
                  control={
                    <Checkbox
                      checked={answers?.get(option.id ?? 0)?.optionId === option.id}
                      onChange={(e) => handleOptionChange(idx, option.id ?? 0, e.target.checked)}
                    />
                  }
                  label={option.label}
                  sx={{
                    mb: 1,
                    p: 2,
                    border: '1px solid',
                    borderColor: answers?.get(option.id ?? 0)?.optionId === option.id ? 'primary.main' : 'divider',
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
        )}
      </Box>
    </Box>
  );
};

export default ResponseCard;
