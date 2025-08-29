import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import RedirectionButton from './RedirectionButton';
import { decorators, parameters } from '.storybook/variables';

const meta = {
  component: RedirectionButton,
} satisfies Meta<typeof RedirectionButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters,
  decorators: [decorators],
  args: {
    label: 'RedirectionButton',
    to: '/',
  },
};