'use client';

import { useAuthStore } from '@/store/auth.store';
import SidebarMenuList from '@components/molecular/SidebarMenuList';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Divider, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { UserRole } from '@share/enums/user-role';
import { LocalizationManager } from '@util/LocalizationManager';
import * as React from 'react';
import UserCard from './UserCard';

const drawerBleeding = 50;
const offset = 10;

interface Props {
  menus: MenuModel[];
}
export default function SidebarMobile(props: Props) {
  const { menus } = props;
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const toggleCollapse = () => {
    setOpen(!open);
  };

  return (
    <Stack ref={ref} height="100%" sx={{ position: 'sticky', top: 65, zIndex: 1000 }}>
      <SwipeableDrawer
        container={ref.current}
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        keepMounted
        ModalProps={{
          container: ref.current,
          style: {
            height: '100%',
            overflow: 'visible',
          },
        }}
        slotProps={{
          paper: {
            sx: {
              visibility: 'visible',
              top: 61,
              bottom: 0,
              height: 'calc(100% - 61px)',
              maxWidth: 250,
              width: '100%',
              overflow: 'visible',
            },
          },
        }}
      >
        <Stack
          position="absolute"
          right={-drawerBleeding + offset}
          bottom={0}
          visibility="visible"
          justifyContent="center"
          alignItems="center"
          sx={{
            width: drawerBleeding - offset,
            height: drawerBleeding,
            top: 10,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            backgroundColor: 'background.paper',
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCollapse();
          }}
        >
          <MenuOpenIcon sx={{ rotate: open ? '180deg' : '0deg' }} />
        </Stack>
        <Box sx={{ height: '100%', overflow: 'auto', maxWidth: 250 }}>
          {/* 사용자 카드 - 접힌 상태에서는 아이콘만 */}
          <Box p={3}>
            <UserCard
              name={user?.currentOrganization?.name ?? ''}
              caption={LocalizationManager.translate(user?.role ?? UserRole.Viewer)}
              content={user?.nickname ?? ''}
              nameSize={16}
              profileImage={user?.profileImageUrl ?? ''}
            />
          </Box>

          <Divider />

          {/* 메뉴 리스트 - 접힌 상태에서는 아이콘만 */}
          <SidebarMenuList menus={menus} isCollapsed={!open} />
        </Box>
      </SwipeableDrawer>
    </Stack>
  );
}
