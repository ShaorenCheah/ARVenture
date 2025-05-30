'use client';

import React, { useState } from 'react';
import {
  Box,
  Modal,
  Typography,
  SxProps,
  Theme,
  Button,
  Fade,
  Stack,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  sx?: SxProps<Theme>;
}

const UserModal: React.FC<UserModalProps> = ({ open, onClose, sx = {} }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const modalStyle: SxProps<Theme> = {
    position: 'absolute',
    top: { xs: 'auto', sm: '50%' },
    left: '50%',
    bottom: { xs: 0, sm: 'auto' },
    transform: {
      xs: 'translateX(-50%)',
      sm: 'translate(-50%, -50%)',
    },
    width: { xs: '100%', sm: '500px', md: '525px', lg: '550px', xl: '575px' },
    maxHeight: '100vh',
    bgcolor: 'background.paper',
    borderRadius: { xs: '8px 8px 0 0', sm: 3 },
    boxShadow: 24,
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    p: { xs: 4, sm: 5 },
    // px: { xs: 6, sm: 8, md: 10 },
    ...sx,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Box sx={modalStyle}>
        <Stack
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            minHeight: { xs: 350, sm: 420 },
          }}
        >
          {/* Logo */}
          <Box mb={2}>
            <Box
              component="img"
              src="/icons/ARVentureLogo.png"
              sx={{
                width: '100%',
                height: 'auto',
                maxWidth: { xs: '120px', sm: '170px' },
              }}
            />
          </Box>

          {/* Text Content */}
          <Stack mb={3} spacing={2} sx={{ alignItems: 'start', justifyContent: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Login Account
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.75, color: '#888888' }}>
              Hello, you must log in first to collect collectibles and redeem gifts in Sunway
              ARventure
            </Typography>
          </Stack>

          {/* Text Field */}
          <Stack
            sx={{
              gap: 2,
              alignItems: 'end',
              justifyContent: 'center',
            }}
          >
            <TextField type="email" label="Email Address" fullWidth />
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'hide the password' : 'display the password'}
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            <Button variant="text" color="primary" sx={{ fontWeight: 'bold' }}>
              Forgot Password?
            </Button>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.5, borderRadius: 10 }}
              onClick={onClose}
            >
              Sign In
            </Button>
            <Box sx={{ width: '100%' }}>
              <Typography sx={{ textAlign: 'start', mt: 2, color: '#888888' }}>
                Don't have an account?{' '}
                <Button variant="text" color="primary" sx={{ fontWeight: 'bold' }}>
                  Join Us
                </Button>
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default UserModal;
