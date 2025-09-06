import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { decorators, parameters } from '.storybook/variables';
import UserCard from '../components/organism/UserCard';

const meta = {
  component: UserCard,
} satisfies Meta<typeof UserCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    ...parameters,
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [decorators],
  args: {
    caption: 'Free',
    name: 'John Doe',
    content: 'Free',
    nameSize: 16,
    profileImage: 'https://via.placeholder.com/150',
    isVisible: true,
  },
};
