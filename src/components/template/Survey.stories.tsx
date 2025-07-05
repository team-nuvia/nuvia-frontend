import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Survey from './Survey';

const meta = {
  component: Survey,
} satisfies Meta<typeof Survey>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <Story />
      </LocalizationProvider>
    ),
  ],
  args: {
    survey: {
      title: '고객 만족도 조사',
      description: '저희 서비스에 대한 솔직한 의견을 들려주세요. 소중한 피드백을 바탕으로 더 나은 서비스를 제공하겠습니다.',
      expiresAt: '2025-07-05',
      isPublic: true,
      questions: [],
      status: 'draft',
      category: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
      startDate: new Date(),
      endDate: new Date(),
    },
  },
};
