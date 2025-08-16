import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DataType } from '@share/enums/data-type';
import { QuestionType } from '@share/enums/question-type';
import { SurveyStatus } from '@share/enums/survey-status';
import SurveyDetail from './SurveyDetail';

const meta = {
  component: SurveyDetail,
} satisfies Meta<typeof SurveyDetail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    survey: {
      id: 1,
      hashedUniqueKey: '1234567890',
      subscriptionId: 1,
      category: {
        id: 1,
        name: 'test',
      },
      title: 'test',
      description: 'test',
      author: {
        id: 1,
        name: 'test',
        profileUrl: 'test',
      },
      estimatedTime: 10,
      questions: [
        {
          id: 1,
          idx: 1,
          sequence: 1,
          title: 'test',
          description: 'test',
          questionType: QuestionType.ShortText,
          dataType: DataType.Text,
          isRequired: true,
          questionOptions: [],
          answers: new Map(),
        },
      ],
      isPublic: true,
      status: SurveyStatus.Active,
      questionCount: 10,
      respondentCount: 10,
      viewCount: 10,
      totalResponses: 10,
      isOwner: true,
      expiresAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
};
