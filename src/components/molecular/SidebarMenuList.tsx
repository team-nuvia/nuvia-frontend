'use client';

import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
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
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      sx={{
        mx: 0.2,
        maxWidth: 360,
        bgcolor: 'background.paper',
        ['& *']: {
          whiteSpace: 'nowrap',
        },
        px: 1,
      }}
    >
      {menus.map((menu) => (
        <Fragment key={menu.label}>
          <ListItemButton
            onClick={() => ((menu.children?.length ?? 0) > 0 ? setOpen(!open) : handleClick(menu.to))}
            onMouseEnter={() => (menu.to ? handlePrefetch(menu.to) : undefined)}
          >
            {isCollapsed && (
              <Tooltip title={menu.label} placement="right" arrow>
                <ListItemIcon>{menu.startIcon}</ListItemIcon>
              </Tooltip>
            )}
            {!isCollapsed && <ListItemIcon>{menu.startIcon}</ListItemIcon>}
            {!isCollapsed && <ListItemText primary={menu.label} />}
          </ListItemButton>
          {!isCollapsed && (
            <Collapse in={open} timeout="auto" unmountOnExit>
              {menu.children &&
                menu.children.map((child) => (
                  <Fragment key={child.label}>
                    <ListItemButton onClick={() => handleClick(child.to)} onMouseEnter={() => handlePrefetch(child.to)}>
                      <ListItemIcon>{child.startIcon}</ListItemIcon>
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  </Fragment>
                ))}
            </Collapse>
          )}
        </Fragment>
      ))}
    </List>
  );
};

export default SidebarMenuList;
