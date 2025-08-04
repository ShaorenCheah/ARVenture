// app/firebase/verify-email/page.tsx
import { CircularProgress, Box, Typography } from '@mui/material';
import { Suspense } from 'react';

import VerifyEmailClient from './VerifyEmailClient';

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Box
          minHeight="100vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress sx={{ color: '#ED1D24' }} />
          <Typography mt={2} textAlign="center">
            Loading verification page...
          </Typography>
        </Box>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
