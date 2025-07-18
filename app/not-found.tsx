'use client';

import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

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
      }}
    >
      {/* Card container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: 4,
          py: 5,
          width: '90%',
          maxWidth: 320,
          backgroundColor: '#ffffff',
          borderRadius: 3,
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src="/icons/ARVentureLogo.png"
          alt="ARVenture Logo"
          sx={{
            width: { xs: '140px', sm: '180px', md: '200px' },
            height: 'auto',
            objectFit: 'contain',
            mb: 5,
          }}
          loading="lazy"
          draggable={false}
        />

        {/* 404 Illustration */}
        <Box
          component="img"
          src="/404.png"
          alt="Page Not Found"
          sx={{
            width: '100%',
            maxWidth: '300px',
            mb: 2,
          }}
          loading="lazy"
        />

        {/* Subtle Text */}
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            fontWeight: 500,
            mb: 2,
          }}
        >
          Oops, page not found.
        </Typography>

        {/* Back Button */}
        <Button
          onClick={() => router.replace('/')}
          variant="contained"
          sx={{
            backgroundColor: '#ED1D24',
            textTransform: 'none',
            px: 4,
            mt: 4,
            '&:hover': {
              backgroundColor: '#c5121a',
            },
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
}
