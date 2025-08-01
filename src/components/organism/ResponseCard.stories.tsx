import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DataType } from '@share/enums/data-type';
import { InputType } from '@share/enums/input-type';
import ResponseCard from './ResponseCard';

const meta = {
  component: ResponseCard,
} satisfies Meta<typeof ResponseCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 1,
    index: 1,
    title: '자유입력입니다.',
    description: '자유롭게 입력해주세요.',
    questionType: InputType.ShortText,
    dataType: DataType.Text,
    required: true,
    answers: new Map(),
    options: [],
    handleOptionChange: (questionId, optionId, value) => {
      console.log('🚀 ~ handleOptionChange:', questionId, optionId, value);
    },
  },
};
