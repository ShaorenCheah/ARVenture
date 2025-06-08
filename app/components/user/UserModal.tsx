'use client';

import React, { useState } from 'react';
import { Box, Modal, SxProps, Theme } from '@mui/material';
import LoginForm from './login/LoginForm';
import RegisterForm from './register/RegisterForm';
import { useAuth } from '../../auth/AuthContext';
import ProfileModal from './profile/ProfileModal';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  sx?: SxProps<Theme>;
}

const UserModal: React.FC<UserModalProps> = ({ open, onClose, sx = {} }) => {
  const { user, loading } = useAuth();
  const [view, setView] = useState<'login' | 'register'>('login');

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
        {user ? (
          <ProfileModal user={user} onLogout={onClose} />
        ) : view === 'login' ? (
          <LoginForm onSwitch={() => setView('register')} />
        ) : (
          <RegisterForm onSwitch={() => setView('login')} />
        )}
      </Box>
    </Modal>
  );
};

export default UserModal;
