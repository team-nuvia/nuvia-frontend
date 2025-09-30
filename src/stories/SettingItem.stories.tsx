import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { decorators, parameters } from '.storybook/variables';
import SettingItem from '../components/molecular/SettingItem';

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
    checked: false,
    onSubmit: () => {},
  },
};
