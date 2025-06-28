import RedirectionButton from '@components/atom/RedirectionButton';
import { Stack } from '@mui/material';

interface MenuListProps {
  menus: MenuModel[];
}
const MenuList: React.FC<MenuListProps> = ({
  menus = [],
}: {
  menus: MenuModel[];
}) => {
  return (
    <Stack direction="row" gap={2}>
      {menus.map((menu) => (
        <RedirectionButton key={menu.label} variant="text" {...menu} />
      ))}
    </Stack>
  );
};

export default MenuList;
