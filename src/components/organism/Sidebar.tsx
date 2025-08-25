'use client';

import { USER_ROLE_LABELS } from '@common/variables';
import SidebarMenuList from '@components/molecular/SidebarMenuList';
import { AuthenticationContext } from '@context/AuthenticationContext';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Divider, IconButton, Stack, Tooltip } from '@mui/material';
import { UserRole } from '@share/enums/user-role';
import { useContext, useMemo, useState } from 'react';
import UserCard from './UserCard';

interface SidebarProps {}
const Sidebar: React.FC<SidebarProps> = () => {
  const { user, isVerified } = useContext(AuthenticationContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menus = useMemo(() => {
    return [
      // {
      //   label: '대시보드',
      //   name: 'dashboard',
      //   to: '/dashboard',
      //   startIcon: <SpaceDashboardIcon />,
      // },
      {
        label: '설문',
        name: 'survey',
        to: '/survey',
        startIcon: <DescriptionOutlinedIcon />,
      },
      // {
      //   label: '설정',
      //   name: 'settings',
      //   to: '/settings',
      //   startIcon: <SettingsOutlinedIcon />,
      // },
    ];
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!isVerified) {
    return null;
  }

  return (
    <Stack
      width="100%"
      minWidth={isCollapsed ? 80 : 100}
      maxWidth={isCollapsed ? 80 : 250}
      height="100%"
      bgcolor="background.paper"
      gap={5}
      sx={{
        py: 5,
        borderRightWidth: 1,
        borderRightColor: (theme) => theme.palette.divider,
        borderRightStyle: 'solid',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      <Stack px={2}>
        <Stack direction="row" justifyContent={isCollapsed ? 'center' : 'space-between'} alignItems="center" flexWrap="wrap" gap={2} mb={2}>
          {/* 접기/펼치기 토글 버튼 */}
          <Tooltip title={isCollapsed ? '사이드바 펼치기' : '사이드바 접기'} placement="right" arrow>
            <IconButton
              onClick={toggleCollapse}
              size="small"
              sx={{
                p: 0.5,
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Tooltip>
        </Stack>

        {/* 사용자 카드 - 접힌 상태에서는 아이콘만 */}
        <UserCard
          name={user?.currentOrganization?.name ?? ''}
          caption={USER_ROLE_LABELS[user?.role ?? UserRole.Viewer]}
          content={user?.name ?? ''}
          nameSize={16}
          profileImage={user?.profileImageUrl ?? ''}
        />
      </Stack>

      <Divider />

      {/* 메뉴 리스트 - 접힌 상태에서는 아이콘만 */}
      <SidebarMenuList menus={menus} isCollapsed={isCollapsed} />
    </Stack>
  );
};

export default Sidebar;
