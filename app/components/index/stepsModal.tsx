'use client';

import React, { useState } from 'react';
import { Box, Modal, Typography, SxProps, Theme, Button, Fade, Stack } from '@mui/material';

interface StepsModalProps {
  open: boolean;
  onClose: () => void;
  sx?: SxProps<Theme>;
}

const StepsModal: React.FC<StepsModalProps> = ({ open, onClose, sx = {} }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Discover, Experience, and Explore through AR',
      description:
        'Experience Bandar Sunway in a whole new way — unlock hidden gems and stories through immersive Augmented Reality.',
    },
    {
      title: 'Discover AR Spots',
      description:
        'Tap on the list of AR spots to find their locations and access the unique AR QR codes to unlock the experience.',
    },
    {
      title: 'Collect and Redeem',
      description:
        'Explore AR spots to uncover hidden collectibles and earn rewards along the way, making your journey through Bandar Sunway even more unforgettable.',
    },
  ];

  const isLastStep = currentStep === steps.length - 1;
  const buttonText = isLastStep ? "LET'S EXPLORE" : 'NEXT';

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const modalStyle: SxProps<Theme> = {
    position: 'absolute',
    top: { xs: 'auto', sm: '50%' },
    left: '50%',
    bottom: { xs: 0, sm: 'auto' },
    transform: {
      xs: 'translateX(-50%)',
      sm: 'translate(-50%, -50%)',
    },
    width: { xs: '100%', sm: '425px', md: '475px', lg: '525px', xl: '575px' },
    height: { xs: '400px', sm: '525px', md: '550px', lg: '575px', xl: '600px' },
    maxHeight: '100vh',
    bgcolor: 'background.paper',
    borderRadius: { xs: '8px 8px 0 0', sm: 3 },
    boxShadow: 24,
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    p: { xs: 4, sm: 4, md: 5 },
    px: { xs: 6, sm: 8, md: 10 },
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
          {/* Step content */}

          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              textAlign: 'center',
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
              src={`/steps/step${currentStep + 1}.png`}
              alt={`Step ${currentStep + 1}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
              textAlign: 'center',
            }}
          >
            {steps[currentStep].description}
          </Typography>
          {/* Pagination Dots */}
          <Stack
            sx={{
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                zIndex: 1,
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

            {/* Action Button */}
            <Box sx={{}}>
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
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default StepsModal;
