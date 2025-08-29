import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import CommonButton from './CommonButton';
import { decorators, parameters } from '.storybook/variables';

const meta = {
  component: CommonButton,
} satisfies Meta<typeof CommonButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters,
  decorators: [decorators],
  args: {
    variant: 'contained',
    children: 'Button',
    color: 'white',
    shape: 'default',
  },
  argTypes: {
    shape: {
      options: ['default', 'rounded'],
      control: { type: 'select' },
    },
    variant: {
      options: ['contained', 'outlined', 'text'],
      control: { type: 'select' },
    },
    color: {
      options: [
        'primary',
        'secondary',
        'error',
        'warning',
        'info',
        'success',
        'black',
        'white',
      ],
      control: { type: 'select' },
    },
  },
};
