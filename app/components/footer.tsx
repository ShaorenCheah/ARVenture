import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Stack } from '@mui/material';

const buttonList = [
  { title: 'Home', icon: <HomeOutlinedIcon />, path: '/' },
  { title: 'Collectibles', icon: <EmojiEventsOutlinedIcon />, path: '/' },
  { title: 'Redeem', icon: <RedeemOutlinedIcon />, path: '/' },
  { title: 'Login', icon: <PersonOutlineOutlinedIcon />, path: '/' },
];

export default function BottomAppBar() {
  return (
    <AppBar
      position="fixed"
      color="default"
      sx={{ top: 'auto', bottom: 0, height: { xs: '56px', md: '64px' } }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-around' }}>
        {buttonList.map((item, index) => (
          <Stack key={index} sx={{ flexGrow: 1 }}>
            <IconButton key={index} color="primary" sx={{ flexGrow: 1 }}>
              {item.icon}
            </IconButton>
            <Typography variant="caption" sx={{ flexGrow: 1, textAlign: 'center' }}>
              {item.title}
            </Typography>
          </Stack>
        ))}
      </Toolbar>
    </AppBar>
  );
}
