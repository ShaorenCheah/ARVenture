'use client';

import { Box, Card, CardContent, Typography, CircularProgress, Button } from '@mui/material';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FirebaseEmailVerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'verifying' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkVerificationAndCreateUser = async () => {
      const email = searchParams.get('email');

      if (!email) {
        setStatus('error');
        setErrorMessage('Missing email in verification link.');
        return;
      }

      setStatus('verifying');

      try {
        // Call your API to check verification status and create user record
        const response = await fetch('/api/firebase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            action: 'verify-email',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Verification failed');
        }

        setStatus('success');
      } catch (error: unknown) {
        setStatus('error');
        if (error instanceof Error) {
          setErrorMessage(error.message || 'Email verification failed. Please try again.');
        } else {
          setErrorMessage('Email verification failed. Please try again.');
        }
      }
    };

    checkVerificationAndCreateUser();
  }, [searchParams]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f9f9f9"
      px={2}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: '100%',
          p: 3,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="center" mb={5}>
            <Image
              src="/icons/ARVentureLogo.png"
              alt="Sunway ARVenture Logo"
              width={125}
              height={35}
            />
          </Box>

          {(status === 'loading' || status === 'verifying') && (
            <>
              <CircularProgress sx={{ color: '#ED1D24' }} />
              <Typography mt={2}>
                {status === 'loading' ? 'Loading...' : 'Verifying your email...'}
              </Typography>
              <Typography variant="body2" mt={1} color="text.secondary">
                Please wait while we verify your email address.
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                Email Verified!
              </Typography>
              <Typography mt={1}>You can now log in to your account.</Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 5, width: '120px', backgroundColor: '#ED1D24' }}
                onClick={() => router.push('/')}
              >
                Go to Login
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <Typography variant="h5" fontWeight="bold" color="error.main">
                Verification Failed
              </Typography>
              <Typography mt={1}>{errorMessage}</Typography>
              <Button
                variant="contained"
                sx={{ mt: 5, width: '120px', backgroundColor: '#ED1D24' }}
                onClick={() => router.push('/')}
              >
                Try Again
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
