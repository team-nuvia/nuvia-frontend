import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { decorators, parameters } from '.storybook/variables';
import SurveyProgress from '../components/molecular/SurveyProgress';

const meta = {
  component: SurveyProgress,
} satisfies Meta<typeof SurveyProgress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    ...parameters,
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [decorators],
  args: {
    progress: 50,
  },
};
