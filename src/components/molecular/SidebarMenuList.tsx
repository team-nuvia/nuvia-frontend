'use client';

import { Stack } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarButton from '../atom/SidebarButton';

interface SidebarMenuListProps {
  menus: MenuModel[];
  isCollapsed?: boolean;
}

const SidebarMenuList: React.FC<SidebarMenuListProps> = ({ menus, isCollapsed = false }) => {
  const [selected, setSelected] = useState<MenuModel | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const selectedMenu = menus.filter((menu) => pathname.startsWith(menu.to));
    setSelected(selectedMenu[selectedMenu.length - 1] ?? null);
  }, [pathname, menus]);

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
          isCollapsed={isCollapsed}
        />
      ))}
    </Stack>
  );
};

export default SidebarMenuList;
