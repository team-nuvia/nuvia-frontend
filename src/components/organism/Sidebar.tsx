'use client';

import SidebarMenuList from '@components/molecular/SidebarMenuList';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import { Divider, IconButton, Stack } from '@mui/material';
import { useMemo } from 'react';
import UserCard from './UserCard';

interface SidebarProps {}
const Sidebar: React.FC<SidebarProps> = () => {
  const menus = useMemo(() => {
    return [
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
    ];
  }, []);

  return (
    <Stack
      width="100%"
      minWidth={100}
      maxWidth={250}
      height="100%"
      bgcolor="background.paper"
      gap={5}
      sx={{
        py: 5,
        borderRightWidth: 1,
        borderRightColor: (theme) => theme.palette.divider,
        borderRightStyle: 'solid',
      }}
    >
      <Stack px={2}>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          gap={1}
          mb={2}
        >
          <IconButton>
            <NotificationsOutlinedIcon color="primary" />
          </IconButton>
        </Stack>
        <UserCard name="John Doe" nameSize={20} plan="Free" />
      </Stack>
      <Divider />
      <SidebarMenuList menus={menus} />
    </Stack>
  );
};

export default Sidebar;
