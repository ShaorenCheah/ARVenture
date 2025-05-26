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
    width: { xs: '100%', sm: '60%', md: '50%', lg: '50%', xl: '25%' },
    height: { xs: '50vh', sm: '50vh', md: '52vh', lg: '40vh', xl: '50vh' },
    maxHeight: '100vh',
    bgcolor: 'background.paper',
    borderRadius: { xs: '8px 8px 0 0', sm: 3 },
    boxShadow: 24,
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    p: { xs: 3, sm: 4, md: 5 },
    pb: { xs: 2, sm: 3, md: 4 },
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
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            minHeight: { xs: 350, sm: 420 },
          }}
        >
          {/* Step content with Fade */}
          {steps.map((step, index) => (
            <Fade key={index} in={currentStep === index} timeout={500} unmountOnExit mountOnEnter>
              <Stack
                alignItems="center"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    textAlign: 'center',
                  }}
                >
                  {step.title}
                </Typography>

                <Box
                  sx={{
                    height: { xs: '150px', sm: '240px', md: '300px', lg: '360px' },
                    aspectRatio: '3/2',
                    maxHeight: 240,
                    position: 'relative',
                    mt: 1.5,
                    mb: 2.5,
                  }}
                >
                  <Box
                    component="img"
                    src={`/steps/step${index + 1}.png`}
                    alt={`Step ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      position: 'absolute',
                      top: 0,
                      left: 0,
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
                  {step.description}
                </Typography>
              </Stack>
            </Fade>
          ))}

          {/* Pagination Dots */}
          <Stack>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                position: 'absolute',
                bottom: 72,
                left: 0,
                right: 0,
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
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 24,
                right: 24,
              }}
            >
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
        </Box>
      </Box>
    </Modal>
  );
};

export default StepsModal;
