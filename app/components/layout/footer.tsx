'use client';

import * as React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import UserModal from '../user/UserModal';
import { Stack, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

import { useUserModal } from '../providers/UserModalContext';

export default function BottomAppBar() {
  const { openUserModal, setOpenUserModal } = useUserModal();

  const router = useRouter();

  const buttonList = [
    { title: 'Home', icon: <HomeOutlinedIcon fontSize="small" />, path: '/' },
    {
      title: 'Collectibles',
      icon: <EmojiEventsOutlinedIcon fontSize="small" />,
      path: '/collectibles',
    },
    { title: 'Redeem', icon: <RedeemOutlinedIcon fontSize="small" />, path: '/redeem' },
    {
      title: 'Login',
      icon: <PersonOutlineOutlinedIcon fontSize="small" />,
      path: '/',
      onClick: () => setOpenUserModal(true),
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
          height: { xs: '56px', lg: '80px' },
          backgroundColor: 'white',
          boxShadow: 3,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-around', mx: { xl: 50 }, py: 2 }}>
          {buttonList.map((item, index) => (
            <Stack
              key={index}
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box>
                <IconButton
                  key={index}
                  color="primary"
                  sx={{ flexGrow: 1 }}
                  size="large"
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    else router.push(item.path);
                  }}
                >
                  {item.icon}
                </IconButton>
              </Box>
              <Typography sx={{ flexGrow: 1, textAlign: 'center' }} color="textSecondary">
                {item.title}
              </Typography>
            </Stack>
          ))}
        </Toolbar>
      </AppBar>
      <UserModal open={openUserModal} onClose={() => setOpenUserModal(false)} />
    </>
  );
}
