import AuthenticationProvider from '@context/AuthenticationContext';
import GlobalDialogProvider from '@context/GlobalDialogContext';
import { GlobalSnackbar } from '@context/GlobalSnackbar';
import { GlobalSnackbarSettingProvider } from '@context/GlobalSnackbarSettingProvider';
import { LoadingProvider } from '@context/LoadingContext';
import ReactQueryProvider from '@context/ReactQueryProvider';
import { CssBaseline, Stack, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import type { Parameters } from '@storybook/nextjs-vite';
import { darkTheme } from '@util/theme';
import { PartialStoryFn } from 'storybook/internal/csf';

export const parameters: Parameters = {
  layout: 'fullscreen',
  // viewport: {
  //   defaultViewport: 'vertical',
  //   defaultWidth: '1000px',
  //   defaultHeight: '1000px',
  // },
};

export function decorators(Story: PartialStoryFn) {
  return (
    <ReactQueryProvider>
      <AuthenticationProvider user={null} initialize={false}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <GlobalSnackbarSettingProvider>
              <GlobalSnackbar>
                <GlobalDialogProvider>
                  <LoadingProvider>
                    <Stack direction="row" justifyContent="center" alignItems="center" sx={{ width: '100%', height: '100vh' }}>
                      <Story />
                    </Stack>
                  </LoadingProvider>
                </GlobalDialogProvider>
              </GlobalSnackbar>
            </GlobalSnackbarSettingProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </AuthenticationProvider>
    </ReactQueryProvider>
  );
}
