// app/not-found.tsx
'use client';

import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        gap: 3,
      }}
    >
      <Typography variant="h2">404</Typography>
      <Typography variant="h5">Page Not Found</Typography>
      <Button onClick={() => router.replace('/')} variant="contained">
        Back to Home
      </Button>
    </Box>
  );
}
