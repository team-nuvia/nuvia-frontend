'use client';

import { BRAND_NAME } from '@common/variables';
import ActionButton from '@components/atom/ActionButton';
import CommonText from '@components/atom/CommonText';
import BrandHead from '@components/molecular/BrandHead';
import Notification from '@components/molecular/Notification';
import UserOrganizationSelect from '@components/molecular/UserOrganizationSelect';
import { AuthenticationContext } from '@context/AuthenticationContext';
import { useBlackRouter } from '@hooks/useBlackRouter';
import { useScroll } from '@hooks/useScroll';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { Avatar, Menu, MenuItem, Stack, Toolbar, Tooltip, Typography, useTheme } from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
  const theme = useTheme();
  const { y } = useScroll();
  const router = useBlackRouter();
  const [shadow, setShadow] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { user, clearUser } = useContext(AuthenticationContext);

  // hydration 문제 방지: 서버와 클라이언트의 초기 렌더링이 다를 수 있으므로
  // 로딩 중일 때는 기본 메뉴만 표시하여 hydration mismatch 방지
  const commonMenus: MenuOption[] = useMemo(
    () =>
      user
        ? [
            {
              label: 'Nuvia란?',
              to: '/about',
            },
            {
              label: '커뮤니티',
              to: '/community',
            },
          ]
        : [
            {
              label: 'Nuvia란?',
              to: '/about',
            },
            {
              label: '로그인',
              to: '/auth/login',
            },
          ],
    [user],
  );
  const menus: MenuOption[] = useMemo(
    () =>
      user
        ? [
            { label: 'Profile', to: '/dashboard/user' },
            {
              label: 'Logout',
              request: () => {
                clearUser();
              },
            },
          ]
        : [{ label: 'Login', to: '/auth/login' }],
    [user],
  );

  useEffect(() => {
    if (y > 61) {
      setShadow(true);
    } else {
      setShadow(false);
    }
  }, [y]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Stack>
      {shadow && <Toolbar />}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{
          position: shadow ? 'fixed' : 'static',
          width: '100%',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
            gap: 2,
            transition: '0.3s ease-in-out',
            backgroundColor: theme.palette.background.paper,
            borderRadius: '0.5rem',
            boxShadow: shadow ? '0 0.3rem 1rem -0.5rem #56565656, 0 0.3rem 1rem -0.3rem #56565656' : 'none',
            maxWidth: shadow ? '98%' : '100%',
            py: 1,
            px: 2,
            my: shadow ? 1 : 0,
          }}
        >
          <Stack direction="row" alignItems="center" gap={3.5}>
            <BrandHead
              title={BRAND_NAME}
              width={45}
              height={45}
              primaryColor={theme.palette.primary.main}
              secondaryColor={theme.palette.secondary.main}
            />
            <Stack direction="row" gap={0.5} justifyContent="flex-start" alignItems="center">
              {commonMenus.map((menu) => (
                <MenuItem
                  key={menu.label}
                  onClick={() => {
                    handleCloseUserMenu();
                    if (menu.request) {
                      if (menu.to) router.push(menu.to);
                      menu.request();
                    } else {
                      if (menu.to) router.push(menu.to);
                    }
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 1.5,
                    py: 1,
                    minHeight: '1rem',
                    minWidth: '1rem',
                    borderRadius: '0.5rem',
                    '&:hover': {
                      bgcolor: 'transparent',
                    },
                  }}
                >
                  <Typography sx={{ textAlign: 'center' }}>{menu.label}</Typography>
                </MenuItem>
              ))}
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" gap={2}>
            {user && (
              <Stack direction="row" alignItems="center" gap={2}>
                {/* 조직 선택 */}
                <UserOrganizationSelect />

                {/* 알림 아이콘 */}
                <Notification />

                <Tooltip title="사용자 메뉴">
                  <ActionButton
                    onClick={handleOpenUserMenu}
                    size="small"
                    color="primary"
                    startIcon={
                      user.profileImageUrl ? (
                        <Avatar src={user.profileImageUrl} alt={BRAND_NAME} sx={{ width: 35, height: 35 }} />
                      ) : (
                        <AccountCircleRoundedIcon sx={{ width: 35, height: 35 }} />
                      )
                    }
                  >
                    <CommonText thickness="bold" fontSize={16} color="primary.main">
                      {user.name}
                    </CommonText>
                  </ActionButton>
                </Tooltip>
              </Stack>
            )}

            <Menu
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {menus.map((menu) => (
                <MenuItem
                  key={menu.label}
                  onClick={() => {
                    handleCloseUserMenu();
                    if (menu.request) {
                      if (menu.to) router.push(menu.to);
                      menu.request();
                    } else {
                      if (menu.to) router.push(menu.to);
                    }
                  }}
                >
                  <Typography sx={{ textAlign: 'center' }}>{menu.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Toolbar>
      </Stack>
    </Stack>
  );
};

export default Header;
