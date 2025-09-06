import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { decorators, parameters } from '.storybook/variables';
import CommonText from '../components/atom/CommonText';

const meta = {
  component: CommonText,
} satisfies Meta<typeof CommonText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters,
  decorators: [decorators],
  args: {
    children: 'CommonText',
    variant: 'body1',
    color: 'text.secondary',
    thickness: 'regular',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'body1',
        'body2',
        'caption',
        'button',
        'overline',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
      ],
    },
    color: {
      control: { type: 'inline-radio' },
      options: ['text.primary', 'text.secondary', 'text.disabled'],
    },
    thickness: {
      control: { type: 'select' },
      options: ['thin', 'regular', 'medium', 'bold'],
    },
  },
};
