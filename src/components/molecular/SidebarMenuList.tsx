'use client';

import { Stack } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import SidebarButton from '../atom/SidebarButton';

interface SidebarMenuListProps {
  menus: MenuModel[];
}
const SidebarMenuList: React.FC<SidebarMenuListProps> = ({ menus }) => {
  const [selected, setSelected] = useState<MenuModel | null>(null);
  const pathname = usePathname();
  const currentSelect = useMemo(() => {
    return pathname;
  }, [pathname]);

  useEffect(() => {
    const selectedMenu = menus.find((menu) =>
      currentSelect.startsWith(menu.to),
    );

    if (selectedMenu) {
      setSelected(selectedMenu ?? menus[0]);
    }
  }, [currentSelect]);

  const onClick = (menu: MenuModel) => {
    setSelected(menu);
  };

  return (
    <Stack px={2} gap={1}>
      {menus.map((menu) => (
        <SidebarButton
          key={menu.label}
          menu={menu}
          selected={selected}
          onClick={onClick}
          color={selected?.name === menu.name ? 'primary' : 'black'}
        />
      ))}
    </Stack>
  );
};

export default SidebarMenuList;
