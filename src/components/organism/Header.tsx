'use client';

import { BRAND_NAME, LOGO_ONLY } from '@common/variables';
import BrandHead from '@components/molecular/BrandHead';
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
  const menus = useMemo(
    () => [
      {
        label: 'Login',
        to: '/',
      },
    ],
    [],
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
      <BrandHead title={BRAND_NAME} logo={LOGO_ONLY} width={35} height={35} />

      <Tooltip title="Profile">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            src={LOGO_ONLY}
            alt={BRAND_NAME}
            sx={{ width: 35, height: 35 }}
          />
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
              router.push(menu.to);
            }}
          >
            <Typography sx={{ textAlign: 'center' }}>{menu.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};

export default Header;
