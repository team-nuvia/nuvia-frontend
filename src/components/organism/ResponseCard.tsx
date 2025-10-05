import { QuestionAnswerFileNestedResponseDto } from '@share/interface/ianswer-nested';
import ActionButton from '@components/atom/ActionButton';
import CommonText from '@components/atom/CommonText';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Checkbox, Chip, FormControl, FormControlLabel, FormGroup, Grid, Radio, RadioGroup, Rating, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { IQuestionOption } from '@share/interface/iquestion';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

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
  answers: Map<number, { optionId: number | null; value: string | number | null; referenceBuffer: QuestionAnswerFileNestedResponseDto | null }>;
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const inputValueType = useMemo(() => {
    switch (dataType) {
      case DataType.Image:
        return 'file';
      case DataType.Video:
        return 'file';
      case DataType.File:
        return 'file';
      // case DataType.Location:
      //   return 'text';
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

  function bufferToBase64ImageUrl(bufferData: any, mimeType: string = 'image/jpeg'): string {
    const uint8Array = new Uint8Array(bufferData.data || bufferData);

    // Base64 인코딩
    let binary = '';
    uint8Array.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    const base64 = btoa(binary);

    return `data:${mimeType};base64,${base64}`;
  }

  useEffect(() => {
    const file = answers.get(1)?.value as unknown as File;
    const referenceBuffer = answers.get(1)?.referenceBuffer as unknown as QuestionAnswerFileNestedResponseDto;

    if (DataType.Image !== dataType && DataType.File !== dataType && DataType.Video !== dataType) {
      return;
    }

    console.log('🚀 ~ ResponseCard ~ answers.get(1):', answers.get(1));
    console.log('🚀 ~ ResponseCard ~ referenceBuffer:', referenceBuffer);
    if (referenceBuffer) {
      const imageUrl = bufferToBase64ImageUrl(referenceBuffer.buffer.data, referenceBuffer.mimetype);
      console.log('🚀 ~ ResponseCard ~ imageUrl:', imageUrl);
      setPreviewImage(imageUrl);
      return;
    }

    if (!file || !(file instanceof File)) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.onerror = (error) => console.error(error);
  }, [answers.get(1)?.value, answers.get(1)?.referenceBuffer]);

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
        <Stack direction="row" gap={1}>
          <Stack
            position="relative"
            flex={1}
            direction="row"
            gap={1}
            alignItems="center"
            justifyContent="center"
            width="auto"
            minWidth={600}
            minHeight={300}
            height="auto"
            sx={{ backgroundColor: 'grey' }}
          >
            {(answers?.get(1)?.value || previewImage) && (
              /* 이미지 사이징 자동화?? */
              <Image
                src={previewImage ?? ''}
                alt="이미지 미리보기"
                fill // This makes the image fill its parent
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimize image loading for different screen sizes
                style={{ objectFit: 'contain', borderRadius: 8, border: '1px solid #eee' }}
                unoptimized
              />
            )}
          </Stack>
          <Box>
            <ActionButton component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              이미지 등록
              <input
                type="file"
                accept="image/*"
                // value={answers?.get(1)?.value}
                onChange={(e) => handleOptionChange(idx, 1, e.currentTarget.files?.[0])}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 1,
                  height: 1,
                  overflow: 'hidden',
                  clip: 'rect(0 0 0 0)',
                  clipPath: 'inset(50%)',
                }}
              />
            </ActionButton>
          </Box>
        </Stack>
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
    // if (dataType === DataType.Location) {
    //   /* 설문 응답할 때 처리 */
    //   // return (
    //   //   <CommonText variant="caption" color="error">
    //   //     설문응답 시 표시됩니다.
    //   //   </CommonText>
    //   // );
    //   return;
    // }
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
