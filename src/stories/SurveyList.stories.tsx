'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { decorators, parameters } from '.storybook/variables';
import SurveyList from '../components/template/survey/SurveyList';

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
  decorators: [decorators],
  args: {},
};
