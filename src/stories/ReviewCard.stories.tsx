import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ReviewCard from '../components/organism/ReviewCard';

const meta = {
  component: ReviewCard,
} satisfies Meta<typeof ReviewCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    txt: '예쁘고 기능도 좋아요!',
    av: 'K',
    who: '프리랜서 디자이너 김효*',
  },
};