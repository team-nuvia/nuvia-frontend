'use client';

import { useRouter } from 'next/navigation';
import CommonButton from './CommonButton';
import CommonText from './CommonText';
import { ButtonOwnProps } from '@mui/material';

interface SidebarButtonProps {
  selected: MenuModel | null;
  menu: MenuModel;
  onClick: (menu: MenuModel) => void;
}
const SidebarButton: React.FC<SidebarButtonProps & ButtonOwnProps> = ({
  selected,
  menu,
  onClick,
  ...props
}) => {
  const router = useRouter();

  return (
    <CommonButton
      sx={{
        justifyContent: 'flex-start',
        background:
          selected?.name === menu.name
            ? (theme) => theme.palette.primary.main + '26'
            : 'transparent',
        px: '1rem !important',
        textTransform: 'capitalize',
        '&:hover': {
          background:
            selected?.name === menu.name
              ? (theme) => theme.palette.primary.main + '26 !important'
              : 'transparent !important',
          boxShadow: 'none !important',
          opacity: '1 !important',
        },
      }}
      startIcon={menu.startIcon}
      endIcon={menu.endIcon}
      onClick={() => {
        onClick(menu);
        router.push(menu.to);
      }}
      {...props}
    >
      <CommonText>{menu.label}</CommonText>
    </CommonButton>
  );
};

export default SidebarButton;
