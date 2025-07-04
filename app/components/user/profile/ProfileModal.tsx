'use client';

import { Button, Typography, Stack } from '@mui/material';
import { User, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

import { auth } from '@/lib/firebase';

interface ProfileModalProps {
  user: User;
  onLogout: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully.');
      onLogout();
    } catch {
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Welcome, {user.email}</Typography>
      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
    </Stack>
  );
};

export default ProfileModal;
