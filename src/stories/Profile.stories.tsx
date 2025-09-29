import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { parameters } from '.storybook/variables';
import { Stack } from '@mui/material';
import { PartialStoryFn } from 'storybook/internal/csf';
import Profile from '../components/template/Profile';

const meta = {
  component: Profile,
} satisfies Meta<typeof Profile>;

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
    (Story: PartialStoryFn) => {
      return (
        <Stack direction="row" justifyContent="center" sx={{ width: '100%' }}>
          <Story />
        </Stack>
      );
    },
  ],
  args: {},
};
