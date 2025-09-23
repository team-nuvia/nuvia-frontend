import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import QuestionCard from '../components/organism/QuestionCard';

const meta = {
  component: QuestionCard,
} satisfies Meta<typeof QuestionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    idx: 1,
    index: 1,
    title: '질문 제목',
    description: '질문 설명',
    questionType: QuestionType.ShortText,
    dataType: DataType.Text,
    isRequired: true,
    questionOptions: [
      {
        id: null,
        idx: 1,
        label: '옵션 1',
        sequence: 0,
      },
    ],
    handleChangeBy: () => {},
    handleChangeQuestionType: () => {},
    handleAddOption: () => {},
    handleRemoveQuestion: () => {},
    handleRemoveOption: () => {},
  },
};
