import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import StatisticsCard from './StatisticsCard';
import { decorators, parameters } from '.storybook/variables';

const meta = {
  component: StatisticsCard,
} satisfies Meta<typeof StatisticsCard>;

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
    title: 'Survey Creation',
    description: 'Survey Creation',
  },
};
