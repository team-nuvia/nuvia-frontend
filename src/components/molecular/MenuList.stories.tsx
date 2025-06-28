import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import MenuList from './MenuList';
import { decorators, parameters } from '.storybook/variables';

const meta = {
  component: MenuList,
} satisfies Meta<typeof MenuList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters,
  decorators: [decorators],
  args: {
    menus: [
      {
        label: 'Menu1',
        name: 'menu1',
        to: '/menu1',
      },
      {
        label: 'Menu2',
        name: 'menu2',
        to: '/menu2',
      },
    ],
  },
};
