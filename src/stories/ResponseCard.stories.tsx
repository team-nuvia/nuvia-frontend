import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import ResponseCard from '../components/organism/ResponseCard';

const meta = {
  component: ResponseCard,
} satisfies Meta<typeof ResponseCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: null,
    idx: 1,
    index: 1,
    title: '자유입력입니다.',
    description: '자유롭게 입력해주세요.',
    questionType: QuestionType.ShortText,
    dataType: DataType.Text,
    isRequired: true,
    answers: new Map(),
    questionOptions: [],
    handleOptionChange: (questionId, optionId, value) => {
      console.log('🚀 ~ handleOptionChange:', questionId, optionId, value);
    },
  },
};
