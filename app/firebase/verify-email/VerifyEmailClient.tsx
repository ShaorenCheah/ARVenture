'use client';

import { Box, Card, CardContent, Typography, CircularProgress, Button } from '@mui/material';
import { applyActionCode, checkActionCode } from 'firebase/auth';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { auth } from '@/lib/firebase';

export default function FirebaseEmailVerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (mode !== 'verifyEmail' || !oobCode) {
        setStatus('error');
        setErrorMessage('Invalid verification link.');
        return;
      }

      try {
        // Apply the verification code
        await applyActionCode(auth, oobCode);

        // Get the email from the code
        const result = await checkActionCode(auth, oobCode);
        const email = result.data.email;

        // Send it to API route to create the Firestore document
        await fetch('/api/firebase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        setStatus('success');
      } catch (error: unknown) {
        let message = 'Verification failed.';

        if (error instanceof Error) {
          message = error.message;
        }

        setStatus('error');
        setErrorMessage(message);
      }
    };

    verifyEmail();
  }, [mode, oobCode]);

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

          {status === 'verifying' && (
            <>
              <CircularProgress sx={{ color: '#ED1D24' }} />
              <Typography mt={2} textAlign="center">
                Verifying your email...
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <Typography variant="h5" fontWeight="bold" color="success.main" textAlign="center">
                Email Verified!
              </Typography>
              <Typography mt={1} textAlign="center">
                You can now log in to your account.
              </Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 5, width: '100px', backgroundColor: '#ED1D24' }}
                onClick={() => router.push('/')}
              >
                Go to Login
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <Typography variant="h5" fontWeight="bold" color="error.main" textAlign="center">
                Verification Failed
              </Typography>
              <Typography mt={1} textAlign="center">
                {errorMessage || 'The verification link is invalid or expired.'}
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 5, width: '100px', backgroundColor: '#ED1D24' }}
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
