'use client';

import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';

interface SidebarMenuListProps {
  menus: MenuModel[];
  isCollapsed?: boolean;
}

const SidebarMenuList: React.FC<SidebarMenuListProps> = ({ menus, isCollapsed = false }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClick = (to?: string) => {
    if (to) router.push(to);
  };

  const handlePrefetch = (to?: string) => {
    if (to) router.prefetch(to);
  };

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} component="nav" aria-labelledby="nested-list-subheader">
      {menus.map((menu) => (
        <Fragment key={menu.label}>
          <ListItemButton
            onClick={() => ((menu.children?.length ?? 0) > 0 ? setOpen(!open) : handleClick(menu.to))}
            onMouseEnter={() => ((menu.children?.length ?? 0) > 0 ? setOpen(!open) : handlePrefetch(menu.to))}
            sx={{ p: isCollapsed ? 1 : undefined }}
          >
            <ListItemIcon sx={isCollapsed ? { flex: 1, justifyContent: 'center' } : {}}>{menu.startIcon}</ListItemIcon>
            {!isCollapsed && <ListItemText primary={menu.label} />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {!isCollapsed &&
              menu.children &&
              menu.children.map((child) => (
                <Fragment key={child.label}>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    onClick={() => (child.request ? child.request() : handleClick(child.to))}
                    onMouseEnter={() => (child.request ? child.request() : handlePrefetch(child.to))}
                  >
                    <ListItemIcon>{child.startIcon}</ListItemIcon>
                    <ListItemText primary={child.label} />
                  </ListItemButton>
                </Fragment>
              ))}
          </Collapse>
        </Fragment>
      ))}
    </List>
  );
};

export default SidebarMenuList;
