import { PreviewPayload } from '@/models/PreviewPayload';
import CommonText from '@components/atom/CommonText';
import ResponseSurvey from '@components/template/ResponseSurvey';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Box, Chip, Container, Divider, IconButton, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';

interface PreviewProps {
  survey: PreviewPayload;
  handleClose: () => void;
  isDemo?: boolean;
  isBind?: boolean;
}

const Preview: React.FC<PreviewProps> = ({ survey, handleClose, isDemo = false, isBind = false }) => {
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

  const ScreenController = () => {
    return (
      <Box
        sx={{
          transition: 'all 0.3s ease',
          position: 'absolute',
          top: isFullscreen ? 8 : 16,
          right: isFullscreen ? 8 : 16,
          zIndex: 1001,
          backgroundColor: isFullscreen ? 'background.paper' : 'transparent',
          borderRadius: isFullscreen ? 1 : 0,
          boxShadow: isFullscreen ? theme.shadows[8] : 'none',
          p: isFullscreen ? 1 : 0,
        }}
      >
        <Stack direction="row" spacing={1}>
          <IconButton onClick={toggleFullscreen} title={isFullscreen ? '전체화면 해제' : '전체화면'}>
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={handleClose} title="닫기">
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>
    );
  };

  return (
    <Paper
      component={Stack}
      sx={{
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        height: 'calc(100% - 2rem)',
        p: isFullscreen ? 0 : 2,
        backgroundColor: 'background.paper',
        boxShadow: isFullscreen ? 'none' : theme.shadows[24],
        borderRadius: isFullscreen ? 0 : theme.shape.borderRadius,

        ...(!isBind && {
          position: 'fixed',
          top: isFullscreen ? 0 : 15,
          left: isFullscreen ? 0 : 15,
          right: isFullscreen ? 0 : 15,
          bottom: isFullscreen ? 0 : 15,
          zIndex: 1000,
        }),
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Container>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {!isBind && !isFullscreen && (
            <Box mb={2}>
              <CommonText variant="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                미리보기
                <Chip label="미리보기 모드" size="small" color="primary" variant="outlined" />
              </CommonText>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                ESC 키를 눌러 닫을 수 있습니다
              </Typography>
            </Box>
          )}
          <ScreenController />
        </Stack>
      </Container>

      {!isFullscreen && (
        <Container>
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
          height: '100%',
          overflowY: 'auto',
          backgroundColor: isFullscreen ? 'background.default' : 'background.paper',
        }}
      >
        <ResponseSurvey survey={survey} isDemo={isDemo} />
      </Box>
    </Paper>
  );
};

export default Preview;
