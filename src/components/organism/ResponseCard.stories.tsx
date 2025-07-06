import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ResponseCard from './ResponseCard';
import { DataType, InputType } from '@share/enums/question-type';

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
    handleOptionClear: () => {
      console.log('🚀 ~ handleOptionClear:');
    },
  },
};
