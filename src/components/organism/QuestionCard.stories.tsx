import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import QuestionCard from './QuestionCard';

const meta = {
  component: QuestionCard,
} satisfies Meta<typeof QuestionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 1,
    index: 1,
    title: 'Question 1',
    description: 'Description 1',
    questionType: QuestionType.ShortText,
    dataType: DataType.Text,
    isRequired: true,
    options: [],
    questions: [],
    setFieldValue: () => {},
    setFieldError: () => {},
    setFieldTouched: () => {},
    touched: {},
    errors: {},
  },
};
