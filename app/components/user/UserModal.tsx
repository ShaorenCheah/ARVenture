'use client';

import React, { useState, useEffect } from 'react';
import { Box, Modal, SxProps, Theme, Fade } from '@mui/material';
import LoginForm from './login/LoginForm';
import RegisterForm from './register/RegisterForm';
import { useAuth } from '../../auth/AuthContext';
import ProfileModal from './profile/ProfileModal';
import ForgotPasswordForm from './forgotPassword/ForgotPasswordForm';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  sx?: SxProps<Theme>;
}

const UserModal: React.FC<UserModalProps> = ({ open, onClose, sx = {} }) => {
  const { user } = useAuth();
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [localUser, setLocalUser] = useState(user); // <- local copy

  // Delay update of localUser until modal fully closes
  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => {
        setLocalUser(user);
      }, 300); // allow modal to fade out before setting
      return () => clearTimeout(timeout);
    }
  }, [open, user]);

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
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Fade in={open} timeout={400}>
        <Box sx={modalStyle} key={view}>
          <Fade in key={view} timeout={400}>
            <Box>{renderContent()}</Box>
          </Fade>
        </Box>
      </Fade>
    </Modal>
  );
};

export default UserModal;
