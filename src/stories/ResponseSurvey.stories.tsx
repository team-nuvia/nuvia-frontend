import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ResponseSurvey from '@components/template/public/ResponseSurvey';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { SurveyStatus } from '@share/enums/survey-status';

const meta = {
  component: ResponseSurvey,
} satisfies Meta<typeof ResponseSurvey>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    survey: {
      id: 1,
      hashedUniqueKey: '1234567890',
      subscriptionId: 1,
      title: '고객 만족도 조사',
      author: {
        id: 1,
        name: 'John Doe',
        profileUrl: 'https://via.placeholder.com/150',
      },
      description: '저희 서비스에 대한 솔직한 의견을 들려주세요. 소중한 피드백을 바탕으로 더 나은 서비스를 제공하겠습니다.',
      expiresAt: new Date('2025-07-05'),
      isPublic: true,
      category: {
        id: 1,
        name: 'customer',
      },
      totalResponses: 10,
      respondentCount: 10,
      viewCount: 10,
      status: SurveyStatus.Active,
      questionCount: 10,
      isOwner: true,
      estimatedTime: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      questions: [
        {
          id: 1,
          idx: 1,
          sequence: 1,
          title: '자유입력입니다.',
          description: '자유롭게 입력해주세요.',
          questionType: QuestionType.ShortText,
          dataType: DataType.Text,
          isRequired: true,
          questionOptions: [
            {
              id: 1,
              idx: 1,
              sequence: 1,
              label: '옵션 1',
            },
          ],
          questionAnswers: new Map(),
          isAnswered: true,
        },
        {
          id: 2,
          idx: 2,
          sequence: 2,
          title: '자유입력입니다.2',
          description: '자유롭게 입력해주세요.2',
          questionType: QuestionType.LongText,
          dataType: DataType.Text,
          isRequired: false,
          questionOptions: [
            {
              id: 1,
              idx: 1,
              sequence: 1,
              label: '옵션 1',
            },
            {
              id: 2,
              idx: 2,
              sequence: 2,
              label: '옵션 2',
            },
            {
              id: 3,
              idx: 3,
              sequence: 3,
              label: '옵션 3',
            },
            {
              id: 4,
              idx: 4,
              sequence: 4,
              label: '옵션 4',
            },
          ],
          questionAnswers: new Map(),
          isAnswered: true,
        },
        {
          id: 3,
          idx: 3,
          sequence: 3,
          title: '선택해주세요.',
          description: '선택해주세요.',
          questionType: QuestionType.SingleChoice,
          dataType: DataType.Text,
          isRequired: true,
          questionOptions: [
            { id: 1, idx: 1, sequence: 1, label: '옵션 1' },
            { id: 2, idx: 2, sequence: 2, label: '옵션 2' },
            { id: 3, idx: 3, sequence: 3, label: '옵션 3' },
          ],
          questionAnswers: new Map(),
          isAnswered: true,
        },
        {
          id: 4,
          idx: 4,
          sequence: 4,
          title: '날짜 질문입니다.',
          description: '날짜 질문입니다.',
          questionType: QuestionType.ShortText,
          dataType: DataType.Date,
          isRequired: false,
          questionOptions: [{ id: 1, idx: 1, sequence: 1, label: '옵션 1' }],
          questionAnswers: new Map(),
          isAnswered: true,
        },
        {
          id: 5,
          idx: 5,
          sequence: 5,
          title: '별점 질문입니다.',
          description: '별점 질문입니다.',
          questionType: QuestionType.ShortText,
          dataType: DataType.Rating,
          isRequired: false,
          questionOptions: [{ id: 1, idx: 1, sequence: 1, label: '옵션 1' }],
          questionAnswers: new Map(),
          isAnswered: true,
        },
        {
          id: 6,
          idx: 6,
          sequence: 6,
          title: '이미지 질문입니다.',
          description: '이미지 질문입니다.',
          questionType: QuestionType.ShortText,
          dataType: DataType.Image,
          isRequired: false,
          questionOptions: [{ id: 1, idx: 1, sequence: 1, label: '옵션 1' }],
          questionAnswers: new Map(),
          isAnswered: true,
        },
        {
          id: 7,
          idx: 7,
          sequence: 7,
          title: '링크 질문입니다.',
          description: '링크 질문입니다.',
          questionType: QuestionType.ShortText,
          dataType: DataType.Link,
          isRequired: false,
          questionOptions: [{ id: 1, idx: 1, sequence: 1, label: '옵션 1' }],
          questionAnswers: new Map(),
          isAnswered: true,
        },
        {
          id: 8,
          idx: 8,
          sequence: 8,
          title: '링크 질문입니다.',
          description: '링크 질문입니다.',
          questionType: QuestionType.SingleChoice,
          dataType: DataType.Text,
          isRequired: false,
          questionOptions: [
            { id: 1, idx: 1, sequence: 1, label: '옵션 1' },
            {
              id: 2,
              idx: 2,
              sequence: 2,
              label: '옵션 2',
            },
            {
              id: 3,
              idx: 3,
              sequence: 3,
              label: '옵션 3',
            },
          ],
          questionAnswers: new Map(),
          isAnswered: true,
        },
        {
          id: 9,
          idx: 9,
          sequence: 9,
          title: '링크 질문입니다.',
          description: '링크 질문입니다.',
          questionType: QuestionType.MultipleChoice,
          dataType: DataType.Text,
          isRequired: true,
          questionOptions: [
            { id: 1, idx: 1, sequence: 1, label: '옵션 1' },
            {
              id: 2,
              idx: 2,
              sequence: 2,
              label: '옵션 2',
            },
            {
              id: 3,
              idx: 3,
              sequence: 3,
              label: '옵션 3',
            },
          ],
          questionAnswers: new Map(),
          isAnswered: true,
        },
      ],
      questionAnswers: [],
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
