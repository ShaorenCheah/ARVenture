import { Button, Typography, Stack } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface ProfileModalProps {
  user: any;
  onLogout: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onLogout }) => {
  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
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
