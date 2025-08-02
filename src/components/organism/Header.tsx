'use client';

import { BRAND_NAME, LOGO_ONLY } from '@common/variables';
import BrandHead from '@components/molecular/BrandHead';
import { AuthenticationContext } from '@context/AuthenticationContext';
import { GlobalSnackbarContext } from '@context/GlobalSnackbar';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { Avatar, IconButton, Menu, MenuItem, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useContext, useMemo, useState } from 'react';

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
  const theme = useTheme();
  const { user, clearUser } = useContext(AuthenticationContext);
  const { addNotice } = useContext(GlobalSnackbarContext);
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
            {
              label: '설문 모아보기',
              to: '/survey',
            },
          ]
        : [
            {
              label: 'Nuvia란?',
              to: '/about',
            },
          ],
    [user],
  );

  const menus: MenuOption[] = useMemo(
    () =>
      user
        ? [
            {
              label: 'Profile',
              to: '/user',
            },
            {
              label: 'Logout',
              to: '/',
              request: async () => {
                await clearUser();
                addNotice('로그아웃 되었습니다.', 'success');
              },
            },
          ]
        : [
            {
              label: 'Login',
              to: '/auth/login',
            },
          ],
    [user],
  );
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        width: '100%',
        // boxShadow:
        // '0 0.3rem 1rem -0.5rem #56565656, 0 0.3rem 1rem -0.3rem #56565656',
        borderBottomWidth: 1,
        borderBottomColor: (theme) => theme.palette.divider,
        borderBottomStyle: 'solid',
        p: '1rem',
      }}
    >
      <BrandHead title={BRAND_NAME} width={45} height={45} primaryColor={theme.palette.primary.main} secondaryColor={theme.palette.secondary.main} />

      <Stack direction="row" alignItems="center" gap={2}>
        <Stack direction="row" alignItems="center" gap={1}>
          {commonMenus.map((menu) => (
            <MenuItem
              key={menu.label}
              onClick={() => {
                handleCloseUserMenu();
                if (menu.request) {
                  menu.request().then(() => {
                    router.push(menu.to);
                  });
                } else {
                  router.push(menu.to);
                }
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
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

        <Tooltip title="Profile">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            {user ? (
              <Avatar src={user.profileImageUrl ?? LOGO_ONLY} alt={BRAND_NAME} sx={{ width: 35, height: 35 }} />
            ) : (
              <AccountCircleRoundedIcon sx={{ width: 35, height: 35 }} />
            )}
          </IconButton>
        </Tooltip>

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
                  menu.request().then(() => {
                    router.push(menu.to);
                  });
                } else {
                  router.push(menu.to);
                }
              }}
            >
              <Typography sx={{ textAlign: 'center' }}>{menu.label}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Stack>
    </Stack>
  );
};

export default Header;
