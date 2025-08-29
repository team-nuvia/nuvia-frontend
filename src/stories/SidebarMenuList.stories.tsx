import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { decorators, parameters } from '.storybook/variables';
import SidebarMenuList from './SidebarMenuList';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const meta = {
  component: SidebarMenuList,
} satisfies Meta<typeof SidebarMenuList>;

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
    menus: [
      {
        label: '대시보드',
        name: 'dashboard',
        to: '/',
        startIcon: <SpaceDashboardIcon />,
      },
      {
        label: '설문',
        name: 'poll',
        to: '/poll',
        startIcon: <DescriptionOutlinedIcon />,
      },
      {
        label: '통계·분석',
        name: 'analysis',
        to: '/analysis',
        startIcon: <PollOutlinedIcon />,
      },
      {
        label: '설정',
        name: 'settings',
        to: '/settings',
        startIcon: <SettingsOutlinedIcon />,
      },
    ],
  },
};
