'use client';

import { ButtonOwnProps, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import CommonButton from './CommonButton';
import CommonText from './CommonText';

interface SidebarButtonProps {
  selected: MenuModel | null;
  menu: MenuModel;
  onClick: (menu: MenuModel) => void;
  isCollapsed?: boolean;
}

const SidebarButton: React.FC<SidebarButtonProps & ButtonOwnProps> = ({ selected, menu, onClick, isCollapsed = false, ...props }) => {
  const router = useRouter();

  return (
    <Tooltip title={menu.label} placement="right" arrow disableHoverListener={!isCollapsed}>
      <CommonButton
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          background: selected?.name === menu.name ? (theme) => theme.palette.primary.main + '26' : 'transparent',
          px: isCollapsed ? '0.5rem !important' : '1rem !important',
          minWidth: 'auto',
          textTransform: 'capitalize',
          '&:hover': {
            background: selected?.name === menu.name ? (theme) => theme.palette.primary.main + '26 !important' : 'transparent !important',
            boxShadow: 'none !important',
            opacity: '1 !important',
          },
        }}
        // startIcon={menu.startIcon}
        // endIcon={menu.endIcon}
        onClick={() => {
          onClick(menu);
          if (menu.to) router.push(menu.to);
        }}
        {...props}
      >
        {menu.startIcon}
        {!isCollapsed && <CommonText>{menu.label}</CommonText>}
      </CommonButton>
    </Tooltip>
  );
};

export default SidebarButton;
