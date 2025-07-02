'use client';

import React, { useState } from 'react';
import {
  Box,
  Modal,
  Typography,
  SxProps,
  Theme,
  Button,
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RedeemIcon from '@mui/icons-material/Redeem';
import toast from 'react-hot-toast';

interface RedeemCollectibleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string, position: GeolocationPosition | null) => void;
}

const RedeemCollectibleModal: React.FC<RedeemCollectibleModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const modalStyle: SxProps<Theme> = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };

  const handleRedeem = async () => {
    setSubmitting(true);
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onSubmit(code.trim(), position);
          setSubmitting(false);
        },
        (error) => {
          toast.error('Location access is required to redeem.');
          setSubmitting(false);
        },
        { enableHighAccuracy: true }
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to get location.');
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ '& .MuiBackdrop-root': { backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
    >
      <Box sx={modalStyle}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Redeem Collectible
        </Typography>

        <TextField
          label="Enter Redemption Code"
          variant="outlined"
          fullWidth
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={submitting}
        />

        <Button
          onClick={handleRedeem}
          variant="contained"
          color="error"
          startIcon={<RedeemIcon />}
          disabled={submitting || !code.trim()}
        >
          {submitting ? 'Checking...' : 'REDEEM NOW'}
        </Button>
      </Box>
    </Modal>
  );
};

export default RedeemCollectibleModal;
