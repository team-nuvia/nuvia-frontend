import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { decorators, parameters } from '.storybook/variables';
import Footer from './Footer';

const meta = {
  component: Footer,
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters,
  decorators: [decorators],
  args: {},
};