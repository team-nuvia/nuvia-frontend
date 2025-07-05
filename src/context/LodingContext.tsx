'use client';

import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { createContext, useState } from 'react';

export const LoadingContext = createContext({
  loading: true,
  setLoading: (loading: boolean, loadingText?: string) => {},
});

interface LoadingProviderProps {
  children: React.ReactNode;
}
export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading...');

  const handleSetLoading = (loading: boolean, loadingText?: string) => {
    setLoading(loading);
    if (!loading) setLoadingText(loadingText || 'Loading...');
  };

  return (
    <LoadingContext.Provider value={{ loading, setLoading: handleSetLoading }}>
      <Stack flex={1} sx={{ position: 'relative' }}>
        {children}
      </Stack>
      {loading && (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{
            background: (theme) => theme.palette.background.paper,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <LinearProgress sx={{ width: 200, mb: 2 }} />
              <Typography color="text.secondary">{loadingText}</Typography>
            </Box>
          </Box>
        </Stack>
      )}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
