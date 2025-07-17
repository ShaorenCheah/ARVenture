'use client';

import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

import animationData from '@/app/assets/splash.json';

interface SplashScreenProps {
  duration?: number; // in milliseconds
}

export default function SplashScreen({ duration = 3000 }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), duration - 500); // Start fading out ~500ms before hiding
    const hideTimer = setTimeout(() => setVisible(false), duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]);

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        background: '#fff',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        overflow: 'hidden',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
      }}
    >
      {/* Mobile recommendation (top) */}
      {!isMobile && (
        <Box
          sx={{
            position: 'absolute',
            top: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderRadius: '20px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            padding: '8px 16px',
            animation: 'fadeIn 1s ease-out 1s both',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
            },
          }}
        >
          <PhoneAndroidIcon fontSize="small" sx={{ color: '#666' }} />
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: '0.5px',
            }}
          >
            View on mobile for better experience
          </Typography>
        </Box>
      )}

      {/* Main content container */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          px: 4,
          py: 5,
          width: '90%',
          maxWidth: 320,
          backgroundColor: 'white',
          animation: 'fadeInUp 0.8s ease-out',
          '@keyframes fadeInUp': {
            '0%': {
              opacity: 0,
              transform: 'translateY(30px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '120%',
              height: '120%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              zIndex: -1,
            },
          }}
        >
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{
              width: '100%',
              maxWidth: 300,
              height: 'auto',
              marginBottom: -12,
            }}
          />
        </Box>

        <Box
          component="img"
          src="/icons/titleLogo.png"
          alt="ARVenture Logo"
          sx={{
            width: { xs: '140px', sm: '180px', md: '220px' },
            height: 'auto',
            objectFit: 'contain',
            mt: -1,
            animation: 'slideIn 1s ease-out 0.3s both',
            '@keyframes slideIn': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
          loading="lazy"
          draggable="false"
        />
      </Box>

      {/* Loading dots animation */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 30, sm: 80 },
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.8 },
            '50%': { opacity: 1 },
          },
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#ED1D24',
              animation: `dotBounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
              '@keyframes dotBounce': {
                '0%, 80%, 100%': {
                  transform: 'scale(0)',
                  opacity: 0.5,
                },
                '40%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
