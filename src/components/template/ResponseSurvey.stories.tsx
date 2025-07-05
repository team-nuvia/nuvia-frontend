import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import ResponseSurvey from './ResponseSurvey';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataType, InputType } from '@models/enums/question-type';

const meta = {
  component: ResponseSurvey,
} satisfies Meta<typeof ResponseSurvey>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    survey: {
      title: '고객 만족도 조사',
      description:
        '저희 서비스에 대한 솔직한 의견을 들려주세요. 소중한 피드백을 바탕으로 더 나은 서비스를 제공하겠습니다.',
      expiresAt: '2025-07-05',
      isPublic: true,
      status: 'active',
      category: 'customer',
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
      ],
      managementPassword: 'password',
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
