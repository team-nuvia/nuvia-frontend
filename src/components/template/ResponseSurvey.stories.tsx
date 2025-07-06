import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ResponseSurvey from './ResponseSurvey';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataType, InputType } from '@share/enums/question-type';

const meta = {
  component: ResponseSurvey,
} satisfies Meta<typeof ResponseSurvey>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    survey: {
      title: '고객 만족도 조사',
      name: 'John Doe',
      description:
        '저희 서비스에 대한 솔직한 의견을 들려주세요. 소중한 피드백을 바탕으로 더 나은 서비스를 제공하겠습니다.',
      expiresAt: '2025-07-05',
      isPublic: true,
      category: 'customer',
      participants: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      questions: [
        {
          id: 1,
          title: '자유입력입니다.',
          description: '자유롭게 입력해주세요.',
          questionType: InputType.ShortText,
          dataType: DataType.Text,
          required: true,
          options: [
            {
              id: 1,
              label: '옵션 1',
            },
          ],
          answers: new Map(),
        },
        {
          id: 2,
          title: '자유입력입니다.2',
          description: '자유롭게 입력해주세요.2',
          questionType: InputType.LongText,
          dataType: DataType.Text,
          required: false,
          options: [
            {
              id: 1,
              label: '옵션 1',
            },
            {
              id: 2,
              label: '옵션 2',
            },
            {
              id: 3,
              label: '옵션 3',
            },
            {
              id: 4,
              label: '옵션 4',
            },
          ],
          answers: new Map(),
        },
        {
          id: 3,
          title: '선택해주세요.',
          description: '선택해주세요.',
          questionType: InputType.SingleChoice,
          dataType: DataType.Text,
          required: true,
          options: [
            { id: 1, label: '옵션 1' },
            { id: 2, label: '옵션 2' },
            { id: 3, label: '옵션 3' },
          ],
          answers: new Map(),
        },
        {
          id: 4,
          title: '날짜 질문입니다.',
          description: '날짜 질문입니다.',
          questionType: InputType.ShortText,
          dataType: DataType.Date,
          required: false,
          options: [{ id: 1, label: '옵션 1' }],
          answers: new Map(),
        },
        {
          id: 5,
          title: '별점 질문입니다.',
          description: '별점 질문입니다.',
          questionType: InputType.ShortText,
          dataType: DataType.Rating,
          required: false,
          options: [{ id: 1, label: '옵션 1' }],
          answers: new Map(),
        },
        {
          id: 6,
          title: '이미지 질문입니다.',
          description: '이미지 질문입니다.',
          questionType: InputType.ShortText,
          dataType: DataType.Image,
          required: false,
          options: [{ id: 1, label: '옵션 1' }],
          answers: new Map(),
        },
        {
          id: 7,
          title: '링크 질문입니다.',
          description: '링크 질문입니다.',
          questionType: InputType.ShortText,
          dataType: DataType.Link,
          required: false,
          options: [{ id: 1, label: '옵션 1' }],
          answers: new Map(),
        },
        {
          id: 8,
          title: '링크 질문입니다.',
          description: '링크 질문입니다.',
          questionType: InputType.SingleChoice,
          dataType: DataType.Text,
          required: false,
          options: [
            { id: 1, label: '옵션 1' },
            {
              id: 2,
              label: '옵션 2',
            },
            {
              id: 3,
              label: '옵션 3',
            },
          ],
          answers: new Map(),
        },
        {
          id: 9,
          title: '링크 질문입니다.',
          description: '링크 질문입니다.',
          questionType: InputType.MultipleChoice,
          dataType: DataType.Text,
          required: true,
          options: [
            { id: 1, label: '옵션 1' },
            {
              id: 2,
              label: '옵션 2',
            },
            {
              id: 3,
              label: '옵션 3',
            },
          ],
          answers: new Map(),
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <Story />
      </LocalizationProvider>
    ),
  ],
};
