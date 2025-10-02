'use client';

import { useAuthStore } from '@/store/auth.store';
import queryKeys from '@/store/lib/query-key';
import { getUserOrganizations } from '@api/user/get-user-organizations';
import SidebarMenuList from '@components/molecular/SidebarMenuList';
import { GlobalDialogContext } from '@context/GlobalDialogContext';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import { Box, Divider, IconButton, Stack, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';
import { UserRole } from '@share/enums/user-role';
import { useQuery } from '@tanstack/react-query';
import { LocalizationManager } from '@util/LocalizationManager';
import { roleAtLeast } from '@util/roleAtLeast';
import { useContext, useMemo, useState } from 'react';
import InviteDialog from '../template/teams/InviteDialog';
import SidebarMobile from './SidebarMobile';
import UserCard from './UserCard';

interface SidebarProps {}
const Sidebar: React.FC<SidebarProps> = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useAuthStore((state) => state.user);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const { data } = useQuery({
    queryKey: queryKeys.organization.list(),
    queryFn: getUserOrganizations,
    enabled: !!user,
  });
  const { handleOpenDialog } = useContext(GlobalDialogContext);

  const { currentOrganization } = data?.payload ?? {};
  const handleOpenInviteDialog = () => {
    if (!currentOrganization?.id) {
      return;
    }
    handleOpenDialog({
      title: '초대 코드 생성',
      content: <InviteDialog subscriptionId={currentOrganization.id} />,
      useConfirm: false,
    });
  };

  const teamFeatures: MenuModel[] = [
    {
      label: '팀 목록',
      name: 'teams',
      to: '/dashboard/teams',
    },
  ];

  if (roleAtLeast(UserRole.Admin, currentOrganization?.role)) {
    teamFeatures.push({
      label: '팀 초대',
      name: 'invite',
      // to: '/teams/list',
      request: () => handleOpenInviteDialog(),
    });
  }

  const menus = useMemo(() => {
    const teamMenu: MenuModel = {
      label: '팀 관리',
      name: 'teams',
      startIcon: <GroupOutlinedIcon />,
      endIcon: <ChevronRightIcon />,
      children: teamFeatures,
    };

    const menus: MenuModel[] = [
      {
        label: '대시보드',
        name: 'dashboard',
        to: '/dashboard',
        startIcon: <SpaceDashboardIcon />,
      },
      {
        label: '설문 관리',
        name: 'survey',
        to: '/dashboard/survey',
        startIcon: <DescriptionOutlinedIcon />,
      },
    ];
    if (currentOrganization?.target === SubscriptionTargetType.Organization) {
      menus.push(teamMenu);
    }
    menus.push({
      label: '설정',
      name: 'settings',
      to: '/dashboard/settings',
      startIcon: <SettingsOutlinedIcon />,
    });

    return menus.filter(Boolean);
  }, [currentOrganization, teamFeatures]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!user) {
    return null;
  }

  if (isMobile) {
    return <SidebarMobile menus={menus} />;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: isCollapsed ? 80 : 250, transition: 'all 0.3s ease' }}>
      <Stack
        width="100%"
        minWidth={isCollapsed ? 80 : 250}
        maxWidth={isCollapsed ? 80 : 250}
        height="100%"
        bgcolor="background.paper"
        gap={3}
        sx={{
          py: 5,
          borderRightWidth: 1,
          borderRightColor: (theme) => theme.palette.divider,
          borderRightStyle: 'solid',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflowX: 'hidden',
          zIndex: 999,
        }}
      >
        <Stack px={2}>
          <Stack direction="row" justifyContent={isCollapsed ? 'center' : 'flex-end'} alignItems="center" flexWrap="wrap" gap={2} mb={2}>
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
                {isCollapsed ? <MenuOpenIcon sx={{ rotate: '180deg' }} /> : <MenuOpenIcon />}
              </IconButton>
            </Tooltip>
          </Stack>

          {/* 사용자 카드 - 접힌 상태에서는 아이콘만 */}
          <UserCard
            name={user?.currentOrganization?.name ?? ''}
            caption={LocalizationManager.translate(user?.role ?? UserRole.Viewer)}
            content={user?.nickname ?? ''}
            nameSize={16}
            profileImage={user?.profileImageUrl ?? ''}
          />
        </Stack>

        <Divider />

        {/* 메뉴 리스트 - 접힌 상태에서는 아이콘만 */}
        <SidebarMenuList menus={menus} isCollapsed={isCollapsed} />
      </Stack>
    </Box>
  );
};

export default Sidebar;
