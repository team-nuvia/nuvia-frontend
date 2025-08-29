'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { parameters } from '.storybook/variables';
import AuthenticationProvider from '@/context/AuthenticationContext';
import { LoadingProvider } from '@/context/LodingContext';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import ReactQueryProvider from '@util/react-query-provider';
import { lightTheme } from '@util/theme';
import SurveyList from './SurveyList';

const meta = {
  component: SurveyList,
} satisfies Meta<typeof SurveyList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    ...parameters,
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => {
      return (
        <ReactQueryProvider>
          <AuthenticationProvider>
            <AppRouterCacheProvider>
              <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <LoadingProvider>
                  <Story />
                </LoadingProvider>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </AuthenticationProvider>
        </ReactQueryProvider>
      );
    },
  ],
  args: {},
};
