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

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      // subheader={
      //   <ListSubheader component="div" id="nested-list-subheader">
      //     Nuvia Menu List
      //   </ListSubheader>
      // }
    >
      {menus.map((menu) => (
        <Fragment key={menu.label}>
          <ListItemButton onClick={() => (menu.children?.length ? setOpen(!open) : handleClick(menu.to))} sx={{ p: isCollapsed ? 1 : undefined }}>
            <ListItemIcon sx={isCollapsed ? { flex: 1, justifyContent: 'center' } : {}}>{menu.startIcon}</ListItemIcon>
            {!isCollapsed && <ListItemText primary={menu.label} />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {!isCollapsed &&
              menu.children &&
              menu.children.map((child) => (
                <Fragment key={child.label}>
                  <ListItemButton sx={{ pl: 4 }} onClick={() => (child.request ? child.request() : handleClick(child.to))}>
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
