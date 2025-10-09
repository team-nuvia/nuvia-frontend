import {
  Box,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { SurveyStatus } from '@share/enums/survey-status';
import { ICategory } from '@share/interface/icategory';
import { LocalizationManager } from '@util/LocalizationManager';
import dayjs from 'dayjs';
import { memo } from 'react';

interface SurveyInformationProps {
  isEditing: boolean;
  categories: ICategory[];
  handleChange: (name: string, value: any) => void;
  title: string;
  description: string | null;
  expiresAt: Date | null;
  isPublic: boolean;
  status: SurveyStatus;
  categoryId: string;
  touchedTitle?: boolean;
  touchedExpiresAt?: boolean;
  touchedCategoryId?: boolean;
  errorsTitle?: string;
  errorsExpiresAt?: string;
  errorsCategoryId?: string;
}
const SurveyInformation: React.FC<SurveyInformationProps> = ({
  isEditing,
  categories,
  handleChange,
  title,
  description,
  expiresAt,
  isPublic,
  status,
  categoryId,
  touchedTitle,
  touchedExpiresAt,
  touchedCategoryId,
  errorsTitle,
  errorsExpiresAt,
  errorsCategoryId,
}) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        mt: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
      }}
    >
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1,
            fontSize: { xs: '1.75rem', md: '2.25rem' },
          }}
        >
          {isEditing ? '설문 수정' : '설문 제작'}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontWeight: 400,
          }}
        >
          {isEditing ? '기존 설문을 수정해보세요' : '새로운 설문을 만들어보세요'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* 기본 정보 섹션 */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '1.125rem',
            }}
          >
            기본 정보
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="설문 제목"
              required
              name="title"
              value={title}
              onChange={(e) => handleChange('title', e.target.value)}
              error={touchedTitle && Boolean(errorsTitle)}
              helperText={touchedTitle && errorsTitle}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                },
              }}
            />

            <TextField
              fullWidth
              label="설문 설명 (선택)"
              multiline
              rows={4}
              name="description"
              value={description}
              onChange={(e) => handleChange('description', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                },
              }}
            />
          </Box>
        </Box>

        {/* 설정 섹션 */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '1.125rem',
            }}
          >
            설정
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <DateTimePicker
              label="만료일 (선택)"
              value={expiresAt ? dayjs(expiresAt) : null}
              onChange={(value) => handleChange('expiresAt', value?.toISOString() || null)}
              format="YYYY-MM-DD HH:mm"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: touchedExpiresAt && Boolean(errorsExpiresAt),
                  helperText: touchedExpiresAt && errorsExpiresAt,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'background.paper',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                    },
                  },
                },
              }}
            />

            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={isPublic}
                    onChange={(e) => handleChange('isPublic', e.target.checked)}
                    name="isPublic"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'primary.main',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'primary.main',
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      응답 공개 여부
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      다른 사용자들이 응답 결과를 볼 수 있습니다
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                설문 상태
              </Typography>
              <RadioGroup
                row
                aria-labelledby="status-radio-buttons-group-label"
                name="status"
                value={status}
                onChange={(e) => handleChange('status', e.target.value)}
                sx={{ gap: 2 }}
              >
                <FormControlLabel
                  value={SurveyStatus.Draft}
                  control={
                    <Radio
                      sx={{
                        '&.Mui-checked': {
                          color: 'warning.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {LocalizationManager.translate(SurveyStatus.Draft)}
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value={SurveyStatus.Active}
                  control={
                    <Radio
                      sx={{
                        '&.Mui-checked': {
                          color: 'success.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {LocalizationManager.translate(SurveyStatus.Active)}
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value={SurveyStatus.Closed}
                  control={
                    <Radio
                      sx={{
                        '&.Mui-checked': {
                          color: 'error.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {LocalizationManager.translate(SurveyStatus.Closed)}
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </Box>

            <Box>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                카테고리 (선택)
              </Typography>
              <Select
                fullWidth
                name="categoryId"
                value={categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                defaultValue=""
                error={touchedCategoryId && Boolean(errorsCategoryId)}
                displayEmpty
                sx={{
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '& .MuiSelect-select': {
                    fontWeight: 400,
                  },
                }}
              >
                <MenuItem value="" sx={{ color: 'text.secondary' }}>
                  카테고리를 선택해주세요
                </MenuItem>
                {categories?.map((category) => (
                  <MenuItem key={category.id.toString()} value={category.id.toString()} sx={{ fontWeight: 400 }}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {touchedCategoryId && errorsCategoryId && (
                <FormHelperText error sx={{ ml: 0, mt: 1 }}>
                  {errorsCategoryId}
                </FormHelperText>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default memo(SurveyInformation);
