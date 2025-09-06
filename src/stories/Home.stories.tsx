import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { parameters } from '.storybook/variables';
import Home from '../components/template/landing/Home';

const meta = {
  component: Home,
} satisfies Meta<typeof Home>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters,
  args: {},
};
