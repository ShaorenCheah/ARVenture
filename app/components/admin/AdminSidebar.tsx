'use client';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import RedeemIcon from '@mui/icons-material/Redeem';
import StoreIcon from '@mui/icons-material/Store';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles: string[]; // roles allowed to see this item
}

const drawerWidth = 240;

interface AdminSidebarProps {
  role: string | null;
}

export default function AdminSidebar({ role }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems: SidebarItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin',
      roles: ['admin', 'merchant'],
    },
    {
      text: 'Manage Users',
      icon: <PeopleIcon />,
      path: '/admin/users',
      roles: ['admin'],
    },
    {
      text: 'Manage Vouchers',
      icon: <RedeemIcon />,
      path: '/admin/vouchers',
      roles: ['merchant', 'admin'],
    },
    {
      text: 'My Store',
      icon: <StoreIcon />,
      path: '/admin/store',
      roles: ['merchant'],
    },
  ];

  const filteredItems = menuItems.filter((item) => role && item.roles.includes(role));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#f5f5f5',
        },
      }}
    >
      <Toolbar />
      <List>
        {filteredItems.map(({ text, icon, path }) => {
          const isActive = pathname === path;
          return (
            <ListItem
              key={text}
              disablePadding
              sx={{
                bgcolor: isActive ? 'primary.main' : 'inherit',
                color: isActive ? '#fff' : 'inherit',
                '&:hover': {
                  bgcolor: isActive ? 'primary.dark' : '#e0e0e0',
                },
              }}
            >
              <ListItemButton
                onClick={() => router.push(path)}
                sx={{
                  bgcolor: isActive ? 'primary.main' : 'inherit',
                  color: isActive ? '#fff' : 'inherit',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : '#e0e0e0',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#fff' : 'inherit' }}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
