'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { auth } from '@/lib/firebase';

export default function FirebaseResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const oobCode = searchParams.get('oobCode');

  const [status, setStatus] = useState<'verifying' | 'form' | 'success' | 'error'>('verifying');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!oobCode) {
      setStatus('error');
      setErrorMessage('Missing reset code.');
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then(() => setStatus('form'))
      .catch((error) => {
        setStatus('error');
        setErrorMessage(error.message || 'Invalid or expired password reset link.');
      });
  }, [oobCode]);

  const handleSubmit = async () => {
    if (!password || password.length < 8 || !oobCode) return;

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('Password reset failed.');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
    } else {
      setPasswordError('');
    }
  };

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" px={2}>
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
              <Typography mt={2}>Checking reset link...</Typography>
            </>
          )}

          {status === 'form' && (
            <>
              <Typography variant="h5" fontWeight="bold">
                Reset Your Password
              </Typography>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={password}
                onChange={handlePasswordChange}
                error={!!passwordError}
                helperText={passwordError}
                sx={{ mt: 3 }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 5, width: '120px', backgroundColor: '#ED1D24' }}
                disabled={!password || password.length < 8}
                onClick={handleSubmit}
              >
                Confirm Reset
              </Button>
            </>
          )}

          {status === 'success' && (
            <>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                Password Updated!
              </Typography>
              <Typography mt={1}>You can now log in with your new password.</Typography>
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
                Reset Failed
              </Typography>
              <Typography mt={1}>
                {errorMessage || 'The password reset link is invalid or expired.'}
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 5, width: '120px', backgroundColor: '#ED1D24' }}
                onClick={() => router.push('/forgot-password')}
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
