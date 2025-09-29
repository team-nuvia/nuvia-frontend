import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Signup from '@components/template/auth/Signup';

const meta = {
  component: Signup,
} satisfies Meta<typeof Signup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
