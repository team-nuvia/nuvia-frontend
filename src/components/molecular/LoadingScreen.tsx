'use client';

import { Box, LinearProgress, Stack, Typography } from '@mui/material';

interface LoadingScreenProps {
  loadingText?: string;
}
const LoadingScreen: React.FC<LoadingScreenProps> = ({ loadingText = '서비스 로드 중...' }) => {
  return (
    <Stack
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={99999}
      overflow="hidden"
      flex={1}
      direction="row"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        background: (theme) => theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <LinearProgress sx={{ width: 200, mb: 2 }} />
          <Typography color="text.secondary">{loadingText}</Typography>
        </Box>
      </Box>
    </Stack>
  );
};

export default LoadingScreen;
