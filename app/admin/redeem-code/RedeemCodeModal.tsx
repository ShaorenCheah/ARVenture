'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { redeemCode } from './redemptionServices';

interface RedeemCodeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userRole: 'admin' | 'employee';
  currentUserId: string;
  currentUserName: string;
}

export default function RedeemCodeModal({
  open,
  onClose,
  onSuccess,
  userRole,
  currentUserId,
  currentUserName,
}: RedeemCodeModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast.error('Please enter a code');
      return;
    }

    setLoading(true);
    try {
      const result = await redeemCode(
        code.trim().toUpperCase(),
        currentUserId,
        currentUserName,
        userRole
      );

      if (result.success) {
        toast.success(result.message);
        setCode('');
        onSuccess();
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Something went wrong during redemption');
    }
    setLoading(false);
  };

  const handleClose = () => {
    if (!loading) {
      setCode('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Redeem Code</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Redemption Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            inputProps={{ style: { textTransform: 'uppercase', letterSpacing: 2 } }}
            disabled={loading}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleRedeem} variant="contained" disabled={loading || !code.trim()}>
          {loading ? 'Redeeming...' : 'Redeem'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
