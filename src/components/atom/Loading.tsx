'use client';

import { CircularProgress, Stack, useTheme } from '@mui/material';

interface LoadingProps {}
const Loading: React.FC<LoadingProps> = () => {
  const theme = useTheme();

  return (
    <Stack height="100%" justifyContent="center" alignItems="center" sx={{ color: 'text.primary', zIndex: theme.zIndex.drawer + 1 }}>
      <CircularProgress size={50} color="inherit" />
    </Stack>
  );
};

export default Loading;
