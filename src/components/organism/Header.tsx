'use client';

import { useAuthStore } from '@/store/auth.store';
import mutationKeys from '@/store/lib/mutation-key';
import { logout } from '@api/auth/logout';
import { BRAND_NAME } from '@common/variables';
import ActionButton from '@components/atom/ActionButton';
import CommonText from '@components/atom/CommonText';
import BrandHead from '@components/molecular/BrandHead';
import Notification from '@components/molecular/Notification';
import UserOrganizationSelect from '@components/molecular/UserOrganizationSelect';
import { useScroll } from '@hooks/useScroll';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Avatar, IconButton, Menu, MenuItem, Stack, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const { y } = useScroll();
  const [shadow, setShadow] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const user = useAuthStore((state) => state.user);
  const router = useAuthStore((state) => state.router)!;
  const addNotice = useAuthStore((state) => state.addNotice)!;
  const setUser = useAuthStore((state) => state.actions.setUser);
  const setMainUrl = useAuthStore((state) => state.actions.setMainUrl);
  const [commonMenus, setCommonMenus] = useState<MenuOption[]>([
    // {
    //   label: 'Nuvia란?',
    //   to: '/about',
    // },
    {
      label: '구독하기',
      to: '/pricing',
    },
    {
      label: '로그인',
      to: '/auth/login',
    },
  ]);
  const [menus, setMenus] = useState<MenuOption[]>([{ label: 'Login', to: '/auth/login' }]);

  // MUI의 useMediaQuery 훅을 사용하여 모바일 여부를 판별합니다.
  // theme.breakpoints.down('sm')는 MUI의 기본 모바일 브레이크포인트입니다.
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { mutate: logoutMutation } = useMutation({
    mutationKey: mutationKeys.user.logout(),
    mutationFn: logout,
    onSuccess: () => {
      setUser(null);
      setMainUrl('/');
      if (!pathname.startsWith('/auth/login')) {
        router?.push(`/auth/login?redirect=${encodeURIComponent(pathname)}&action=view`);
      }
      addNotice!('로그아웃 되었습니다.', 'success');
    },
  });

  useEffect(() => {
    setCommonMenus(
      user
        ? [
            // {
            //   label: 'Nuvia란?',
            //   to: '/about',
            // },
            // {
            //   label: '커뮤니티',
            //   to: '/community',
            // },
            {
              label: '대시보드',
              to: '/dashboard',
            },
            {
              label: '구독하기',
              to: '/pricing',
            },
          ]
        : [
            // {
            //   label: 'Nuvia란?',
            //   to: '/about',
            // },
            {
              label: '구독하기',
              to: '/pricing',
            },
            {
              label: '로그인',
              to: '/auth/login',
            },
          ],
    );
    setMenus(
      user
        ? [
            { label: '나의 프로필', to: '/dashboard/user' },
            {
              label: '로그아웃',
              request: async () => {
                logoutMutation();
              },
            },
          ]
        : [{ label: '로그인', to: '/auth/login' }],
    );
  }, [user]);

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

  const concatMenus = useMemo(() => {
    const allMenus = [...commonMenus, ...menus].reduce((acc: MenuOption[], menu) => {
      if (acc.some((m) => m.label === menu.label)) {
        return acc;
      }
      return [...acc, menu];
    }, []);
    if (isMobile) {
      return allMenus;
    }
    return menus;
  }, [commonMenus, menus, isMobile]);

  return (
    <Stack
      sx={{
        position: 'sticky',
        width: '100%',
        top: shadow ? 4 : 0,
        zIndex: 1000,
      }}
    >
      {/* <Toolbar /> */}
      <Stack direction="row" alignItems="center" justifyContent="center">
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
            gap: 2,
            transition: '0.3s ease-in-out',
            backgroundColor: theme.palette.background.paper,
            borderRadius: shadow ? '0.5rem' : 0,
            boxShadow: shadow ? '0 0.3rem 1rem -0.5rem #56565656, 0 0.3rem 1rem -0.3rem #56565656' : 'none',
            maxWidth: shadow ? '99.5%' : '100%',
            py: 1,
            px: 2,
          }}
        >
          <Stack direction="row" alignItems="center" gap={3.5}>
            <BrandHead
              title={BRAND_NAME}
              width={45}
              height={45}
              primaryColor={theme.palette.primary.main}
              secondaryColor={theme.palette.secondary.main}
              showVersion
            />
            {!isMobile && (
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
            )}
          </Stack>

          <Stack direction="row" alignItems="center" gap={2}>
            <Stack direction="row" alignItems="center" gap={2}>
              {!isMobile && (
                // {/* 조직 선택 */}
                <UserOrganizationSelect />
              )}

              {/* 알림 아이콘 */}
              <Notification />

              {user ? (
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
                      {user.nickname}
                    </CommonText>
                  </ActionButton>
                </Tooltip>
              ) : (
                isMobile && (
                  <Tooltip title="사용자 메뉴">
                    <IconButton onClick={handleOpenUserMenu} size="small" color="primary">
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                )
              )}
            </Stack>

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
              {concatMenus.map((menu) => (
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
