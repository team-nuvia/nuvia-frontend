import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Header from './Header';
import { decorators, parameters } from '.storybook/variables';

const meta = {
  component: Header,
} satisfies Meta<typeof Header>;

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
    menus: [
      {
        label: 'Home',
        to: '/',
      },
    ],
  },
};
