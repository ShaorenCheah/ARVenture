import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  SportsEsports as SportsIcon,
  CollectionsBookmark as CollectiblesIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
  Redeem as RedemptionIcon,
} from '@mui/icons-material';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  Badge,
  IconButton,
  Tooltip,
} from '@mui/material';
import Image from 'next/image';
import React, { useState } from 'react';

interface SidebarItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
  badge?: number;
}

interface AdminSidebarProps {
  role: string | null;
  userName?: string;
  userRole?: string;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
}

const drawerWidthExpanded = 300;
const drawerWidthCollapsed = 86;

export default function AdminSidebar({
  role,
  userName = 'Admin User',
  userRole = 'Administrator',
  currentPath = '/admin',
  onNavigate = () => {},
  onLogout = () => {},
}: AdminSidebarProps) {
  // const [isCollapsed, setIsCollapsed] = useState(innerWidth < 768); // Collapse on small screens
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to expanded for desktop view

  const menuItems: SidebarItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin',
      roles: ['admin', 'merchant'],
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/admin/users',
      roles: ['admin'],
    },
    {
      text: 'AR Spots',
      icon: <SportsIcon />,
      path: '/admin/ar-spots',
      roles: ['admin'],
    },
    {
      text: 'Collectibles',
      icon: <CollectiblesIcon />,
      path: '/admin/collectibles',
      roles: ['admin'],
    },
    {
      text: 'Redemption Items',
      icon: <RedemptionIcon />,
      path: '/admin/redemption-items',
      roles: ['admin'],
    },
    {
      text: 'Redemption',
      icon: <RedemptionIcon />,
      path: '/admin/redemption',
      roles: ['admin'],
    },
  ];

  const filteredItems = menuItems.filter((item) => role && item.roles.includes(role));

  const handleNavigation = (path: string) => {
    onNavigate(path);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const formatBadgeNumber = (num: number) => {
    if (num > 999) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const drawerWidth = isCollapsed ? drawerWidthCollapsed : drawerWidthExpanded;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease-in-out',
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
        },
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: 64,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: isCollapsed ? 0 : 2,
          py: 2.5,
        }}
      >
        {isCollapsed ? (
          <Tooltip title="Expand" placement="right">
            <IconButton
              onClick={handleToggleCollapse}
              sx={{
                color: 'brand.main',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Image
              width={150}
              height={35}
              src="/icons/ARVenturelogo.png"
              alt="ARVenture Logo"
              style={{ cursor: 'pointer' }}
              onClick={() => handleNavigation('/admin')}
            />
            <Tooltip title="Collapse" placement="right">
              <IconButton
                onClick={handleToggleCollapse}
                sx={{
                  color: 'brand.main',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Toolbar>

      <Divider />

      {/* User Info */}
      <Box
        display="flex"
        alignItems="center"
        sx={{ justifyContent: isCollapsed ? 'center' : 'start' }}
        gap={2}
        p={2}
      >
        <AccountCircleIcon sx={{ fontSize: '32px', color: 'brand.main' }} />
        {!isCollapsed && (
          <Box>
            <Typography variant="h5" fontWeight={'bold'}>
              {userName}
            </Typography>
            <Typography variant="caption">{userRole}</Typography>
          </Box>
        )}
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, px: isCollapsed ? 0.5 : 1, pt: 2 }}>
        {filteredItems.map(({ text, icon, path, badge }) => {
          const isActive = currentPath === path;

          return (
            <ListItem disablePadding key={text} sx={{ mb: 1.5 }}>
              <Tooltip
                title={isCollapsed ? text : ''}
                placement="right"
                disableHoverListener={!isCollapsed}
              >
                <ListItemButton
                  onClick={() => handleNavigation(path)}
                  sx={{
                    borderRadius: 2,
                    mx: isCollapsed ? 1.5 : 1,
                    width: isCollapsed ? 48 : 'auto',
                    height: 48,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    alignItems: 'center',
                    px: isCollapsed ? 0 : 2,
                    transition: 'all 0.2s ease-in-out',
                    bgcolor: isActive ? '#ffdfe0' : 'transparent',
                    color: isActive ? '#ED1D24' : 'text.primary',
                    '&:hover': {
                      bgcolor: isActive ? '#ffdfe0' : 'action.hover',
                      transform: isCollapsed ? 'scale(1.05)' : 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      color: isActive ? '#ED1D24' : 'text.secondary',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {icon}
                  </ListItemIcon>

                  {!isCollapsed && (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                      mr={1.5}
                    >
                      <ListItemText
                        primary={text}
                        sx={{
                          ml: 2,
                          fontVariant: 'body2',
                          fontWeight: isActive ? 600 : 400,
                        }}
                      />
                      {badge && (
                        <Badge
                          badgeContent={formatBadgeNumber(badge)}
                          sx={{
                            '& .MuiBadge-badge': {
                              bgcolor: isActive ? 'brand.accent' : 'brand.main',
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 18,
                              minWidth: 18,
                            },
                          }}
                        />
                      )}
                    </Box>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Logout Button */}
      <Box sx={{ p: isCollapsed ? 0.5 : 1 }}>
        <Tooltip
          title={isCollapsed ? 'Logout' : ''}
          placement="right"
          disableHoverListener={!isCollapsed}
        >
          <ListItemButton
            onClick={onLogout}
            sx={{
              borderRadius: 2,
              minHeight: 48,
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              px: isCollapsed ? 0 : 2,
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.light',
                color: 'error.contrastText',
                transform: isCollapsed ? 'scale(1.05)' : 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: 'inherit',
                minWidth: isCollapsed ? 0 : 40,
                justifyContent: 'center',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: 500,
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
