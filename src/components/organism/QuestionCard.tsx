import { QUESTION_DEFAULT_TYPE_LIST, QUESTION_TYPE_MAP } from '@common/global';
import CommonText from '@components/atom/CommonText';
import { DataType, InputType } from '@models/enums/question-type';
import { IQuestion, IQuestionOption } from '@models/interface/iquestion';
import DeleteIcon from '@mui/icons-material/Delete';
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
  handleQuestionChange: (
    id: number,
    field: keyof IQuestion,
    value: any,
  ) => void;
  handleOptionChange: (
    questionId: number,
    optionId: number,
    value: string,
  ) => void;
  handleRemoveOption: (questionId: number, optionId: number) => void;
  handleAddOption: (questionId: number) => void;
  handleRemoveQuestion: (questionId: number) => void;
}
const QuestionCard: React.FC<QuestionCardProps> = ({
  id,
  index,
  title,
  description,
  questionType,
  dataType,
  required,
  options,
  handleQuestionChange,
  handleOptionChange,
  handleRemoveOption,
  handleAddOption,
  handleRemoveQuestion,
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

  // const dynamicField = useMemo(() => {
  //   if (dataType === DataType.Rating) {
  //     /* 설문 응답할 때 처리 */
  //     return (
  //       <CommonText variant="caption" color="error">
  //         설문응답 시 표시됩니다.
  //       </CommonText>
  //     );
  //     // return (
  //     //   <Rating
  //     //     size="large"
  //     //     value={value ? Number(value) : 0}
  //     //     onChange={(_, value) => handleQuestionChange(id, 'value', value)}
  //     //   />
  //     // );
  //   }
  //   if (dataType === DataType.Email) {
  //     return (
  //       <TextField
  //         fullWidth
  //         size="small"
  //         label="이메일"
  //         type="email"
  //         value={value}
  //         onChange={(e) => handleQuestionChange(id, 'value', e.target.value)}
  //       />
  //     );
  //   }
  //   if (dataType === DataType.Link) {
  //     return (
  //       <TextField
  //         fullWidth
  //         size="small"
  //         label="링크"
  //         type="url"
  //         value={value}
  //         onChange={(e) => handleQuestionChange(id, 'value', e.target.value)}
  //       />
  //     );
  //   }
  //   if (dataType === DataType.Date) {
  //     return (
  //       <DatePicker
  //         label="날짜"
  //         value={dayjs(value)}
  //         onChange={(e) => handleQuestionChange(id, 'value', e?.toISOString())}
  //         slotProps={{
  //           textField: {
  //             size: 'small',
  //           },
  //         }}
  //       />
  //       // <TextField
  //       //   fullWidth
  //       //   size="small"
  //       //   label="날짜"
  //       //   type="date"
  //       //   value={value}
  //       //   onChange={(e) => handleQuestionChange(id, 'value', e.target.value)}
  //       // />
  //     );
  //   }
  //   if (dataType === DataType.DateTime) {
  //     return (
  //       <DateTimePicker
  //         label="날짜/시간"
  //         value={dayjs(value)}
  //         onChange={(e) => handleQuestionChange(id, 'value', e?.toISOString())}
  //         slotProps={{
  //           textField: {
  //             size: 'small',
  //           },
  //         }}
  //       />
  //       // <TextField
  //       //   fullWidth
  //       //   size="small"
  //       //   label="날짜/시간"
  //       //   type="datetime-local"
  //       //   value={value}
  //       //   onChange={(e) => handleQuestionChange(id, 'value', e.target.value)}
  //       // />
  //     );
  //   }
  //   if (dataType === DataType.Time) {
  //     return (
  //       <TimePicker
  //         label="시간"
  //         value={dayjs(value)}
  //         onChange={(e) => handleQuestionChange(id, 'value', e?.toISOString())}
  //         slotProps={{
  //           textField: {
  //             size: 'small',
  //           },
  //         }}
  //       />
  //       // <TextField
  //       //   fullWidth
  //       //   size="small"
  //       //   label="시간"
  //       //   type="time"
  //       //   value={value}
  //       //   onChange={(e) => handleQuestionChange(id, 'value', e.target.value)}
  //       // />
  //     );
  //   }
  //   if (dataType === DataType.File) {
  //     /* 설문 응답할 때 처리 */
  //     return (
  //       <CommonText variant="caption" color="error">
  //         설문응답 시 표시됩니다.
  //       </CommonText>
  //     );
  //     // return (
  //     //   <TextField
  //     //     fullWidth
  //     //     size="small"
  //     //     label="파일"
  //     //     type="file"
  //     //     value={value}
  //     //     onChange={(e) => handleQuestionChange(id, 'value', e.target.value)}
  //     //   />
  //     // );
  //   }
  //   if (dataType === DataType.Image) {
  //     /* 설문 응답할 때 처리 */
  //     return (
  //       <CommonText variant="caption" color="error">
  //         설문응답 시 표시됩니다.
  //       </CommonText>
  //     );
  //     // return (
  //     //   <TextField
  //     //     fullWidth
  //     //     size="small"
  //     //     label="이미지"
  //     //     type="file"
  //     //     slotProps={{
  //     //       htmlInput: {
  //     //         accept: 'image/*',
  //     //       },
  //     //     }}
  //     //     value={value}
  //     //     onChange={(e) => handleQuestionChange(id, 'value', e.target.value)}
  //     //   />
  //     // );
  //   }
  //   if (dataType === DataType.Video) {
  //     /* 설문 응답할 때 처리 */
  //     return (
  //       <CommonText variant="caption" color="error">
  //         설문응답 시 표시됩니다.
  //       </CommonText>
  //     );
  //     // return (
  //     //   <TextField
  //     //     fullWidth
  //     //     size="small"
  //     //     label="비디오"
  //     //     type="file"
  //     //     slotProps={{
  //     //       htmlInput: {
  //     //         accept: 'video/*',
  //     //       },
  //     //     }}
  //     //     value={value}
  //     //     onChange={(e) => handleQuestionChange(id, 'value', e.target.value)}
  //     //   />
  //     // );
  //   }
  //   if (dataType === DataType.Location) {
  //     /* 설문 응답할 때 처리 */
  //     return (
  //       <CommonText variant="caption" color="error">
  //         설문응답 시 표시됩니다.
  //       </CommonText>
  //     );
  //   }
  //   return (
  //     <TextField
  //       fullWidth
  //       size="small"
  //       label="단답형 답변"
  //       type={inputValueType}
  //       value={value}
  //     />
  //   );
  // }, [dataType, handleQuestionChange, id, value]);

  return (
    <Paper key={id} elevation={3} sx={{ p: 4, mt: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid
          size={{ xs: 12, md: 8 }}
          sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
        >
          <TextField
            fullWidth
            size="small"
            label={`질문 ${index}`}
            value={title}
            onChange={(e) => handleQuestionChange(id, 'title', e.target.value)}
            variant="standard"
          />
          <Chip
            color={required ? 'error' : 'default'}
            label={required ? '필수' : '선택'}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Select
            fullWidth
            size="small"
            value={questionType || InputType.ShortText}
            onChange={(e) =>
              handleQuestionChange(
                id,
                'questionType',
                e.target.value as InputType,
              )
            }
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
            onChange={(e) =>
              handleQuestionChange(id, 'description', e.target.value)
            }
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        {/* {
          questionType === InputType.ShortText && dynamicField
          // (
          //   <TextField
          //     fullWidth
          //     size="small"
          //     label="단답형 답변"
          //     type={inputValueType}
          //     {...(dataType === DataType.Rating && {
          //       slotProps: { htmlInput: { min: 0, max: 5, step: 1 } },
          //     })}
          //   />
          // )
        } */}
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
            onChange={(e) => handleOptionChange(id, 1, e.target.value)}
          />
        )}

        {(questionType === InputType.SingleChoice ||
          questionType === InputType.MultipleChoice) && (
          <Box>
            {(options || []).map((option, optIndex) => (
              <Grid container spacing={1} key={option.id} alignItems="center">
                <Grid size={{ xs: 11 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label={`옵션 ${optIndex + 1}`}
                    value={option.label}
                    onChange={(e) =>
                      handleOptionChange(id, option.id, e.target.value)
                    }
                    variant="standard"
                    type={inputValueType}
                  />
                </Grid>
                <Grid size={{ xs: 1 }}>
                  <IconButton
                    onClick={() => handleRemoveOption(id, option.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button onClick={() => handleAddOption(id)} sx={{ mt: 1 }}>
              옵션 추가
            </Button>
          </Box>
        )}
      </Box>

      <Stack
        direction="row"
        gap={1}
        mt={2}
        alignItems="center"
        justifyContent={
          questionType === InputType.ShortText ? 'space-between' : 'flex-end'
        }
      >
        {questionType === InputType.ShortText && (
          <FormControl>
            <RadioGroup
              row
              value={dataType}
              onChange={(e) =>
                handleQuestionChange(id, 'dataType', e.target.value)
              }
            >
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
              {/* <FormControlLabel
                value={DataType.Text}
                control={<Radio />}
                label="텍스트"
              />
              <FormControlLabel
                value={DataType.Image}
                control={<Radio />}
                label="이미지"
              />
              <FormControlLabel
                value={DataType.Video}
                control={<Radio />}
                label="비디오"
              />
              <FormControlLabel
                value={DataType.File}
                control={<Radio />}
                label="파일"
              />
              <FormControlLabel
                value={DataType.Location}
                control={<Radio />}
                label="위치"
              />
              <FormControlLabel
                value={DataType.Rating}
                control={<Radio />}
                label="평점"
              /> */}
            </RadioGroup>
          </FormControl>
        )}
        <IconButton onClick={() => handleRemoveQuestion(id)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
};

export default QuestionCard;
