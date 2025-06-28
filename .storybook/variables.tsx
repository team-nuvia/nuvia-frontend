import { Stack } from '@mui/material';
import type { Parameters, ReactRenderer } from '@storybook/nextjs-vite';
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
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ width: '100%', height: '100vh' }}
    >
      <Story />
    </Stack>
  );
}
