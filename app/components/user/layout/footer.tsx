'use client';

import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import { AppBar, Toolbar, Typography, IconButton, Stack, Box } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import * as React from 'react';

import { useAuth } from '../../../auth/AuthContext';
import { useUserModal } from '../../providers/UserModalContext';
import UserModal from '../UserModal';

export default function BottomAppBar() {
  const { openUserModal, setOpenUserModal } = useUserModal();
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useAuth();

  const buttonList = [
    {
      title: 'Home',
      icon: <HomeOutlinedIcon fontSize="small" />,
      path: '/',
    },
    {
      title: 'Collectibles',
      icon: <EmojiEventsOutlinedIcon fontSize="small" />,
      path: '/collectibles',
    },
    {
      title: 'Redeem',
      icon: <RedeemOutlinedIcon fontSize="small" />,
      path: '/redeem',
    },
    {
      title: user ? 'Logout' : 'Login',
      icon: <PersonOutlineOutlinedIcon fontSize="small" />,
      path: '/',
      onClick: () => setOpenUserModal(true),
      isModal: true,
    },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        sx={{
          top: 'auto',
          bottom: 0,
          height: '75px',
          backgroundColor: 'white',
          boxShadow: 3,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '100%',
            mx: { xs: 0, sm: 20, md: 25, xl: 55 },
          }}
        >
          {buttonList.map((item, index) => {
            const isActive = item.isModal ? openUserModal : pathname === item.path;

            return (
              <Stack
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    borderRadius: '50%',
                    backgroundColor: isActive ? 'brand.main' : 'transparent',
                    mb: 0.5,
                    mt: 0.75,
                  }}
                >
                  <IconButton
                    key={index}
                    sx={{
                      padding: 1,
                      color: isActive ? 'white' : 'text.secondary',
                    }}
                    size="large"
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      else router.push(item.path);
                    }}
                  >
                    {item.icon}
                  </IconButton>
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    textAlign: 'center',
                    color: isActive ? 'brand.accent' : 'text.secondary',
                    fontWeight: isActive ? 'bold' : 'normal',
                  }}
                >
                  {item.title}
                </Typography>
              </Stack>
            );
          })}
        </Toolbar>
      </AppBar>

      <UserModal open={openUserModal} onClose={() => setOpenUserModal(false)} />
    </>
  );
}
