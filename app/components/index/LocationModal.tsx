'use client';

import React from 'react';
import { useState } from 'react';
import {
  Box,
  Modal,
  Typography,
  SxProps,
  Theme,
  Button,
  Card,
  CardMedia,
  Chip,
  IconButton,
  Divider,
  Skeleton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
  spot?: {
    title: string;
    description: string;
    imageUrl: string;
    address?: string;
    collectibleTips?: string;
    arURL?: string;
  };
}

const LocationModal: React.FC<LocationModalProps> = ({ open, onClose, spot }) => {
  const {
    title = 'Unknown',
    address = 'Unknown',
    description = 'No description available.',
    imageUrl = '',
    collectibleTips = 'Look around for the hidden clue!',
    arURL = '',
  } = spot || {};

  const modalStyle: SxProps<Theme> = {
    position: 'absolute',
    top: { xs: 'auto', sm: '50%' },
    left: '50%',
    bottom: { xs: 0, sm: 'auto' },
    transform: {
      xs: 'translateX(-50%)',
      sm: 'translate(-50%, -50%)',
    },
    width: { xs: '100%', sm: '80%', md: '60%', lg: '50%', xl: '30%' },
    maxWidth: '100vw',
    maxHeight: { xs: '75vh', sm: '85vh' },
    bgcolor: 'background.paper',
    borderRadius: { xs: '8px 8px 0 0', sm: 3 },
    boxShadow: 24,
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
  };

  const [imgLoaded, setImgLoaded] = useState(false);

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
        {/* Close Button */}
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 25,
            zIndex: 10,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
            },
            boxShadow: 2,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Scrollable Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            maxHeight: { xs: 'calc(75vh - 56px)', sm: 'calc(85vh - 56px)' },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header Image */}
          <Box sx={{ position: 'relative', height: { xs: 200, sm: 240 } }}>
            <Card
              sx={{
                height: '100%',
                width: '100%',
                borderRadius: '8px 8px 0 0',
                overflow: 'hidden',
              }}
            >
              {!imgLoaded ? (
                <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
              ) : (
                <CardMedia
                  component="img"
                  image={imageUrl}
                  alt={title}
                  onLoad={() => setImgLoaded(true)}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              )}

              {/* Preload to detect cached images */}
              {!imgLoaded && (
                <img
                  src={imageUrl}
                  alt="preload"
                  style={{ display: 'none' }}
                  onLoad={() => setImgLoaded(true)}
                />
              )}
            </Card>

            {/* Only show chip after image is fully loaded */}
            {imgLoaded && (
              <Chip
                label="Find The AR Marker In This Area!"
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 25,
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 'medium',
                  fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' },
                }}
              />
            )}
          </Box>

          {/* Content */}
          <Box sx={{ p: 3, pb: 4 }}>
            {/* Title */}
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                color: 'text.primary',
              }}
            >
              {title}
            </Typography>

            {/* Description Section */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.6,
                }}
              >
                {description}
              </Typography>
            </Box>

            <Divider sx={{ my: 2, borderColor: 'grey.300' }} />

            {/* Address Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                  }}
                >
                  Address
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  pl: 0,
                }}
              >
                {address}
              </Typography>
            </Box>

            <Divider sx={{ my: 2, borderColor: 'grey.300' }} />

            {/* Hidden Collectible Section */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <VisibilityIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                  }}
                >
                  Hidden Collectible
                </Typography>
              </Box>
              <Card
                sx={{
                  bgcolor: 'grey.50',
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    {collectibleTips}
                  </Typography>
                </Box>
              </Card>
            </Box>

            {/* Custom Children Content */}
            {/* {children && (
              <Box sx={{ mb: 3 }}>
                {children}
              </Box>
            )} */}

            {/* Action Button */}
            <Box sx={{ pt: 2 }} display="flex" justifyContent="center">
              <Button
                onClick={() => (window.location.href = arURL)}
                variant="contained"
                size="medium"
                startIcon={<CameraAltIcon />}
                sx={{
                  bgcolor: 'error.main',
                  '&:hover': {
                    bgcolor: 'error.dark',
                  },
                  py: 1,
                  borderRadius: 8,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: 3,
                  width: '100%',
                  maxWidth: { xs: '100%', sm: '300px', md: '350px', lg: '400px' },
                }}
              >
                SCAN AR MARKER
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default LocationModal;
