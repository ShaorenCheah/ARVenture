'use client';

import { CircularProgress, Box, Typography } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FirebaseRedirectClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const handleRedirect = () => {
      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');
      const continueUrl = searchParams.get('continueUrl');

      if (!mode || !oobCode) {
        console.error('Missing required parameters');
        router.replace('/not-found');
        return;
      }

      let email: string | null = null;
      try {
        email = new URL(continueUrl || '').searchParams.get('email');
      } catch {
        console.warn('Invalid continueUrl');
      }

      setIsRedirecting(true);

      const params = new URLSearchParams();
      params.set('mode', mode);
      params.set('oobCode', oobCode);
      if (email) params.set('email', email);

      const queryString = params.toString();

      if (mode === 'verifyEmail') {
        router.replace(`/firebase/verify-email?${queryString}`);
      } else if (mode === 'resetPassword') {
        router.replace(`/firebase/reset-password?${queryString}`);
      } else {
        router.replace('/not-found');
      }
    };

    const timer = setTimeout(handleRedirect, 100);
    return () => clearTimeout(timer);
  }, [searchParams, router]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f9f9f9"
    >
      <CircularProgress sx={{ color: '#ED1D24' }} />
      <Typography mt={2} textAlign="center">
        {isRedirecting ? 'Redirecting...' : 'Processing your request...'}
      </Typography>
    </Box>
  );
}
