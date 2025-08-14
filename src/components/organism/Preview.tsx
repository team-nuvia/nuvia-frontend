import CommonText from '@components/atom/CommonText';
import ResponseSurvey from '@components/template/ResponseSurvey';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Chip, Container, Divider, IconButton, Paper, Stack, Typography, useTheme } from '@mui/material';
import { IResponseSurveyQuestionWithAnswers } from '@share/dto/response-survey';
import { useState } from 'react';

interface PreviewProps {
  survey: IResponseSurveyQuestionWithAnswers;
  handleClose: () => void;
}

const Preview: React.FC<PreviewProps> = ({ survey, handleClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const theme = useTheme();

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <Paper
      sx={{
        p: isFullscreen ? 0 : 2,
        position: 'fixed',
        top: isFullscreen ? 0 : 15,
        left: isFullscreen ? 0 : 15,
        right: isFullscreen ? 0 : 15,
        bottom: isFullscreen ? 0 : 15,
        zIndex: 1000,
        overflow: 'auto',
        backgroundColor: 'background.paper',
        boxShadow: isFullscreen ? 'none' : theme.shadows[24],
        borderRadius: isFullscreen ? 0 : theme.shape.borderRadius,
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {!isFullscreen && (
        <Container>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Box>
              <CommonText variant="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                미리보기
                <Chip label="미리보기 모드" size="small" color="primary" variant="outlined" />
              </CommonText>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                ESC 키를 눌러 닫을 수 있습니다
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={toggleFullscreen} title={isFullscreen ? '전체화면 해제' : '전체화면'}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClose} title="닫기">
                <CloseIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`질문 ${survey.questions.length}개`} size="small" variant="outlined" />
              <Chip
                label={survey.isPublic ? '공개 설문' : '비공개 설문'}
                size="small"
                color={survey.isPublic ? 'success' : 'warning'}
                variant="outlined"
              />
              {survey.expiresAt && <Chip label={`만료: ${survey.expiresAt}`} size="small" variant="outlined" />}
            </Stack>
          </Box>

          <Divider sx={{ mb: 2 }} />
        </Container>
      )}

      <Box
        sx={{
          height: isFullscreen ? '100vh' : 'auto',
          overflow: 'auto',
          backgroundColor: isFullscreen ? 'background.default' : 'transparent',
        }}
      >
        <ResponseSurvey survey={survey} />
      </Box>

      {isFullscreen && (
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 1001,
            backgroundColor: 'background.paper',
            borderRadius: 1,
            boxShadow: theme.shadows[8],
            p: 1,
          }}
        >
          <Stack direction="row" spacing={1}>
            <IconButton onClick={toggleFullscreen} size="small" title="전체화면 해제">
              <FullscreenExitIcon />
            </IconButton>
            <IconButton onClick={handleClose} size="small" title="닫기">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export default Preview;
