import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ActionButton from './ActionButton';
import { decorators, parameters } from '.storybook/variables';

const meta = {
  component: ActionButton,
} satisfies Meta<typeof ActionButton>;

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
    children: 'Action Button',
    onClick: () => {
      alert('action');
    },
  },
};
