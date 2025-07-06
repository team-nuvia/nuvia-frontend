import CommonText from '@components/atom/CommonText';
import { DataType, InputType } from '@share/enums/question-type';
import { IQuestionOption } from '@share/interface/iquestion';
import {
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Grid,
  Rating,
  Stack,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
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

interface ResponseCardProps {
  id: number;
  index: number;
  title: string;
  description: string;
  questionType: InputType;
  dataType: DataType;
  required: boolean;
  answers?: Map<number, any>;
  options?: IQuestionOption[];
  handleOptionChange: (
    questionId: number,
    optionId: number,
    value: any,
  ) => void;
  handleOptionClear: () => void;
}
const ResponseCard: React.FC<ResponseCardProps> = ({
  id,
  index,
  title,
  description,
  questionType,
  dataType,
  required,
  answers,
  options,
  handleOptionChange,
  handleOptionClear,
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

  const dynamicField = useMemo(() => {
    if (dataType === DataType.Rating) {
      /* 설문 응답할 때 처리 */
      return (
        <Rating
          size="large"
          value={answers?.get(1) ? Number(answers?.get(1)) : 0}
          onChange={(_, value) =>
            handleOptionChange(id, 1, value?.toString() || '1')
          }
        />
      );
    }
    if (dataType === DataType.Email) {
      return (
        <TextField
          fullWidth
          size="small"
          label="이메일"
          type="email"
          value={answers?.get(1)}
          onChange={(e) => handleOptionChange(id, 1, e.target.value)}
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
          value={answers?.get(1)}
          onChange={(e) => handleOptionChange(id, 1, e.target.value)}
        />
      );
    }
    if (dataType === DataType.Date) {
      return (
        <DatePicker
          label="날짜"
          value={dayjs(answers?.get(1))}
          onChange={(e) => handleOptionChange(id, 1, e?.toISOString() || '')}
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
          value={dayjs(answers?.get(1))}
          onChange={(e) => handleOptionChange(id, 1, e?.toISOString() || '')}
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
          value={dayjs(answers?.get(1))}
          onChange={(e) => handleOptionChange(id, 1, e?.toISOString() || '')}
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
          value={answers?.get(1)}
          onChange={(e) => handleOptionChange(id, 1, e.target.value)}
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
          value={answers?.get(1)}
          onChange={(e) => handleOptionChange(id, 1, e.target.value)}
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
          value={answers?.get(1)}
          onChange={(e) => handleOptionChange(id, 1, e.target.value)}
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
        value={answers?.get(1)}
        onChange={(e) => {
          handleOptionChange(id, 1, e.target.value);
        }}
      />
    );
  }, [dataType, id, answers]);

  return (
    <Box sx={{ p: 4, mt: 4 }}>
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
              color={
                questionType === InputType.MultipleChoice
                  ? 'primary'
                  : 'default'
              }
              label={
                questionType === InputType.MultipleChoice ? '다중' : '단일'
              }
            />
            <Chip
              size="small"
              color={required ? 'error' : 'default'}
              label={required ? '필수' : '선택'}
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <CommonText variant="body2">{description}</CommonText>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        {questionType === InputType.ShortText && dynamicField}
        {questionType === InputType.LongText && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="장문형 답변"
            type={inputValueType}
            {...(dataType === DataType.Rating && {
              slotProps: { htmlInput: { min: 0, max: 5, step: 1 } },
            })}
            value={answers?.get(1)}
            onChange={(e) => handleOptionChange(id, 1, e.target.value)}
          />
        )}
        {(questionType === InputType.SingleChoice ||
          questionType === InputType.MultipleChoice) && (
          <FormGroup>
            {(options || []).map((option) => (
              <FormControlLabel
                key={option.id}
                label={option.label}
                control={
                  <Checkbox
                    checked={answers?.get(option.id) ?? false}
                    onChange={(e) => {
                      if (questionType === InputType.SingleChoice) {
                        handleOptionClear();
                      }
                      handleOptionChange(id, option.id, e.target.checked);
                    }}
                  />
                }
              />
            ))}
          </FormGroup>
        )}
      </Box>
    </Box>
  );
};

export default ResponseCard;
