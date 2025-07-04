'use client';

import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import {
  Box,
  Modal,
  SxProps,
  Theme,
  Fade,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import ForgotPasswordForm from './forgotPassword/ForgotPasswordForm';
import LoginForm from './login/LoginForm';
import ProfileModal from './profile/ProfileModal';
import RegisterForm from './register/RegisterForm';
import { useAuth } from '../../auth/AuthContext';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  sx?: SxProps<Theme>;
}

const UserModal: React.FC<UserModalProps> = ({ open, onClose, sx = {} }) => {
  const { user } = useAuth();
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [localUser, setLocalUser] = useState(user);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  // Delay update of localUser until modal fully closes
  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => {
        setLocalUser(user);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [open, user]);

  useEffect(() => {
    if (open && !user) {
      setView('login');
    }
  }, [open, user]);

  const modalStyle: SxProps<Theme> = {
    width: '100%',
    maxWidth: isDesktop ? '550px' : '100%',
    bgcolor: 'background.paper',
    borderRadius: isDesktop ? 3 : 0,
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    px: 4,
    py: 4,
    maxHeight: '100vh',
    overflowY: 'auto',
    mx: 'auto',
    ...sx,
  };

  const renderContent = () => {
    if (localUser) {
      return <ProfileModal user={localUser} onLogout={onClose} />;
    }

    switch (view) {
      case 'login':
        return (
          <LoginForm
            onSwitch={() => setView('register')}
            onForgot={() => setView('forgot')}
            onSuccess={onClose}
          />
        );
      case 'register':
        return <RegisterForm onSwitch={() => setView('login')} />;
      case 'forgot':
        return <ForgotPasswordForm onSwitch={() => setView('login')} />;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{
        p: 0,
        m: 0,
        '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      }}
    >
      <Fade in={open} timeout={400}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'background.default',
            zIndex: (theme) => theme.zIndex.modal,
            overflowY: 'auto',
          }}
        >
          <Box sx={modalStyle} key={view}>
            <Box display="flex" justifyContent="space-between" mb={6}>
              {/* Logo */}
              <Box>
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
              {/* Return Button */}
              <Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: 'brand.main',
                }}
              >
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                  <KeyboardReturnIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Content */}
            <Fade in key={view} timeout={400}>
              <Box>{renderContent()}</Box>
            </Fade>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default UserModal;
