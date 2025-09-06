import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { decorators, parameters } from '.storybook/variables';
import RedirectionButton from '../components/atom/RedirectionButton';

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