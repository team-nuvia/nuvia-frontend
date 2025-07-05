import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import UserDescription from './UserDescription';
import { decorators, parameters } from '.storybook/variables';

const meta = {
  component: UserDescription,
} satisfies Meta<typeof UserDescription>;

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