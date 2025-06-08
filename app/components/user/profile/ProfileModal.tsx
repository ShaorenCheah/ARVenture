'use client';

import { Button, Typography, Stack } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface ProfileModalProps {
  user: any;
  onLogout: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully.');
      onLogout();
    } catch (error) {
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
