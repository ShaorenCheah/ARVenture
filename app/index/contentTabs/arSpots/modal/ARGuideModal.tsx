'use client';

import { Box, Modal, Typography, SxProps, Theme, Button, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface ARGuideModalProps {
  open: boolean;
  onClose: () => void;
  onFinish?: () => void;
  sx?: SxProps<Theme>;
}

const ARGuideModal: React.FC<ARGuideModalProps> = ({ open, onClose, onFinish, sx = {} }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [locationPrompted, setLocationPrompted] = useState(false);

  const steps = [
    {
      title: 'Open in WeChat Mobile',
      description:
        'This AR experience only works in the mobile WeChat application, you’ll be redirected shortly.',
    },
    {
      title: 'Find the Hidden Code',
      description:
        'Explore the AR scene carefully. A collectible code will appear somewhere in the augmented world. Look around and take note of it.',
    },
    {
      title: 'Return and Redeem',
      description:
        'Once you’ve found the code, return to this browser and enter it in the "Collectibles" section to unlock your reward.',
    },
  ];

  const isLastStep = currentStep === steps.length - 1;
  const buttonText = isLastStep ? 'START AR EXPERIENCE' : 'NEXT';

  // useEffect(() => {
  //   if (currentStep === steps.length - 1 && !locationPrompted) {
  //     setLocationPrompted(true);
  //     if ('geolocation' in navigator) {
  //       navigator.geolocation.getCurrentPosition(
  //         (pos) => {
  //           console.log('User location granted:', pos.coords);
  //         },
  //         (err) => {
  //           console.log('User denied location:', err.message);
  //         }
  //       );
  //     }
  //   }
  // }, [currentStep, locationPrompted, steps.length]);

  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      setLocationPrompted(false);
    }
  }, [open]);

  const handleNext = () => {
    if (isLastStep) {
      if (onFinish) {
        onFinish();
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const modalStyle: SxProps<Theme> = {
    width: { xs: '100%', sm: '425px', md: '475px', lg: '525px', xl: '575px' },
    maxWidth: '350px',
    maxHeight: '400px',
    height: '100%',
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    outline: 'none',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    p: { xs: 4, sm: 4, md: 5 },
    px: { xs: 5, sm: 8, md: 10 },
    my: { xs: 2, sm: 4 },
    ...sx,
  };

  return (
    <Modal
      open={open}
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          onClose();
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Box sx={modalStyle}>
        <Stack
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            minHeight: { xs: 350, sm: 420 },
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              textAlign: 'center',
              mb: 2,
            }}
          >
            {steps[currentStep].title}
          </Typography>

          <Box
            sx={{
              height: { xs: '125px', sm: '200px', md: '275px', lg: '350px' },
              aspectRatio: '3/2',
              maxHeight: 240,
              position: 'relative',
            }}
          >
            <Box
              component="img"
              src={`/ARsteps/step${currentStep + 1}.png`}
              alt={`Step ${currentStep + 1}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
              textAlign: 'center',
              mt: 2,
            }}
          >
            {steps[currentStep].description}
          </Typography>

          <Stack sx={{ gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                mt: 2,
              }}
            >
              {steps.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: index === currentStep ? 'primary.main' : 'grey.300',
                  }}
                />
              ))}
            </Box>

            <Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleNext}
                sx={{
                  bgcolor: 'error.main',
                  '&:hover': { bgcolor: 'error.dark' },
                  borderRadius: 8,
                  fontWeight: 'bold',
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                  boxShadow: 3,
                }}
              >
                {buttonText}
              </Button>
            </Box>
            <Button
              onClick={onClose}
              sx={{
                fontSize: '0.75rem',
                color: 'text.secondary',
                textTransform: 'none',
              }}
            >
              Cancel and Go Back
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ARGuideModal;
