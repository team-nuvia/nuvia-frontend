import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { decorators, parameters } from '.storybook/variables';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import SidebarButton from '../components/atom/SidebarButton';

const meta = {
  component: SidebarButton,
} satisfies Meta<typeof SidebarButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [decorators],
  parameters: {
    ...parameters,
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    color: 'black',
    menu: {
      label: '대시보드',
      name: 'dashboard',
      to: '/',
      startIcon: <SpaceDashboardIcon />,
    },
    selected: null,
    onClick: (menu: MenuModel) => {
      console.log(menu);
    },
  },
};
