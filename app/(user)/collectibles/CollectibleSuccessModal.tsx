'use client';

import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Box, Modal, Typography, SxProps, Theme, Button } from '@mui/material';
import React from 'react';

interface CollectibleSuccessModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  description: string;
}

const CollectibleSuccessModal: React.FC<CollectibleSuccessModalProps> = ({
  open,
  onClose,
  imageUrl,
  title,
  description,
}) => {
  const modalStyle: SxProps<Theme> = {
    width: 360,
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    outline: 'none',
    p: 4,
    textAlign: 'center',
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box sx={modalStyle}>
        <Typography variant="h4" pb={2} fontWeight="bold" gutterBottom>
          Collectible Discovery!
        </Typography>

        <Box
          component="img"
          src={imageUrl}
          alt={title}
          sx={{
            width: 140,
            height: 140,
            objectFit: 'contain',
            mx: 'auto',
            mb: 2,
            borderRadius: '50%',
            backgroundColor: '#FFF4F4',
            p: 1,
          }}
        />

        <Typography variant="body1" sx={{ pt: 1, mb: 3 }}>
          {description}
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={onClose}
          startIcon={<EmojiEventsIcon />}
          sx={{
            bgcolor: 'error.main',
            '&:hover': { bgcolor: 'error.dark' },
            borderRadius: 9999,
            fontWeight: 'bold',
          }}
        >
          VIEW COLLECTIBLES
        </Button>
      </Box>
    </Modal>
  );
};

export default CollectibleSuccessModal;
