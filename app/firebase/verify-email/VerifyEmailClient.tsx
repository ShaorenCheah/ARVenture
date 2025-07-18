'use client';

import { Box, Card, CardContent, Typography, CircularProgress, Button } from '@mui/material';
import { applyActionCode } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { auth, db } from '@/lib/firebase';

export default function FirebaseEmailVerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (mode !== 'verifyEmail' || !oobCode) {
      setStatus('error');
      setErrorMessage('Invalid verification link.');
      return;
    }

    applyActionCode(auth, oobCode)
      .then(async () => {
        setStatus('success');

        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            // Admin-created user, update verification status
            await updateDoc(userRef, {
              emailVerified: true,
            });
          } else {
            // Self-registered user, create full record
            await setDoc(userRef, {
              email: user.email,
              displayName: user.displayName || '',
              emailVerified: true,
              role: 'user', // default role
              createdAt: serverTimestamp(),
            });
          }
        }
      })
      .catch((error) => {
        setStatus('error');
        setErrorMessage(error.message || 'Verification failed.');
      });
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
