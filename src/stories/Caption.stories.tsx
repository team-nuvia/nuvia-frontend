import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { decorators, parameters } from '.storybook/variables';
import Caption from '../components/atom/Caption';

const meta = {
  component: Caption,
} satisfies Meta<typeof Caption>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters,
  decorators: [decorators],
  args: {
    children: 'Caption',
    align: 'left',
    color: "text.primary",
    thickness: 'regular',
  },
  argTypes: {
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
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
