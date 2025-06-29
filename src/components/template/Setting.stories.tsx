import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Setting from './Setting';

const meta = {
  component: Setting,
} satisfies Meta<typeof Setting>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};