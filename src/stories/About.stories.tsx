import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import About from './About';
import { decorators, parameters } from '.storybook/variables';

const meta = {
  component: About,
} satisfies Meta<typeof About>;

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
