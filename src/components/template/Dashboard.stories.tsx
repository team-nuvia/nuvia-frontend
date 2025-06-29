import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Dashboard from './Dashboard';
import { parameters } from '.storybook/variables';

const meta = {
  component: Dashboard,
} satisfies Meta<typeof Dashboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters,
  args: {},
};
