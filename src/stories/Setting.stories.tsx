import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Setting from '../components/template/user/PersonalSetting';

const meta = {
  component: Setting,
} satisfies Meta<typeof Setting>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};