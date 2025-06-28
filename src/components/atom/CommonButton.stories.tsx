import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import CommonButton from './CommonButton';

const meta = {
  component: CommonButton,
} satisfies Meta<typeof CommonButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'contained',
    children: 'Button',
    color: 'primary',
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
