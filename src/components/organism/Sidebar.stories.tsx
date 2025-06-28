import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Sidebar from './Sidebar';
import { decorators, parameters } from '.storybook/variables';

const meta = {
  component: Sidebar,
} satisfies Meta<typeof Sidebar>;

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
  args: {}
};