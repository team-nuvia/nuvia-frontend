import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import UserDescription from './UserDescription';
import { decorators, parameters } from '.storybook/variables';
import CommonText from '@components/atom/CommonText';

const meta = {
  component: UserDescription,
} satisfies Meta<typeof UserDescription>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    ...parameters,
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [decorators],
  args: {
    name: 'John Doe',
    content: (
      <CommonText color="text.secondary" variant="caption" lineHeight={1}>
        Free
      </CommonText>
    ),
  },
};
