import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import QuestionCard from './QuestionCard';

const meta = {
  component: QuestionCard,
} satisfies Meta<typeof QuestionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};