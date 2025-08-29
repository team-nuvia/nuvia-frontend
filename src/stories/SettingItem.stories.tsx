import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SettingItem from './SettingItem';
import { decorators, parameters } from '.storybook/variables';

const meta = {
  component: SettingItem,
} satisfies Meta<typeof SettingItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters,
  decorators: [decorators],
  args: {
    title: 'Title',
    description: 'Description',
  },
};
