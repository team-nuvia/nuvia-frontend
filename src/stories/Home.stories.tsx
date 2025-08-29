import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Home from './HomeBack';
import { parameters } from '.storybook/variables';

const meta = {
  component: Home,
} satisfies Meta<typeof Home>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters,
  args: {},
};
