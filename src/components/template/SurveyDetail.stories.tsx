import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SurveyDetail from './SurveyDetail';

const meta = {
  component: SurveyDetail,
} satisfies Meta<typeof SurveyDetail>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};