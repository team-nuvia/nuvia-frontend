import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { decorators, parameters } from '.storybook/variables';
import LinkText from '../components/atom/LinkText';

const meta = {
  component: LinkText,
} satisfies Meta<typeof LinkText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters,
  decorators: [decorators],
  args: {
    to: '/',
    children: 'LinkText',
    variant: 'h6',
    thickness: 'bold',
    color: 'text.primary',
    fontFamily: 'Noto Sans KR',
  },             
};