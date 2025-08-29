import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import UserCard from './UserCard';
import { decorators, parameters } from '.storybook/variables';

const meta = {
  component: UserCard,
} satisfies Meta<typeof UserCard>;

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
    name: 'John Doe',
    plan: 'Free',
  },
};