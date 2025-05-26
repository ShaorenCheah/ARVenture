'use client';

import React from 'react';
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
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  address?: string;
  description?: string;
  imageUrl?: string;
  hiddenCollectible?: string;
  children?: React.ReactNode;
  width?: number | string;
  sx?: SxProps<Theme>;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title = 'Sunway University',
  address = '5, Jalan Universiti, Bandar Sunway, 47500 Petaling Jaya, Selangor',
  description = 'Renowned for its cutting-edge architecture and vibrant campus life, Sunway University is a hub of innovation and academic excellence, offering visitors a glimpse into the heart of education and creativity.',
  imageUrl = 'locations/SunwayCollege.jpg',
  hiddenCollectible = 'Look for the pair who stand tall, one full of strength, the other wise and bright. They love to greet visitors in unexpected places—keep your eyes peeled for their playful sight!',
  children,
  width = undefined,
  sx = {},
}) => {
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
        {/* Close Button */}
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
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
            <CardMedia
              component="img"
              height="100%"
              image={imageUrl}
              alt={title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px 8px 0 0',
              }}
            />
            <Chip
              label="Find The AR Marker In This Area!"
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 'medium',
                fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' },
              }}
            />
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
                    {hiddenCollectible}
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
                onClick={() =>
                  (window.location.href =
                    'https://www.kivicube.com/scenes/v148t6VXU9enIyHML79pUr53JqY01ozI')
                }
                variant="contained"
                size="large"
                startIcon={<CameraAltIcon />}
                sx={{
                  bgcolor: 'error.main',
                  '&:hover': {
                    bgcolor: 'error.dark',
                  },
                  py: 2,
                  borderRadius: 8,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: 3,
                  width: { xs: '100%', sm: '50%' },
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

export default CustomModal;
