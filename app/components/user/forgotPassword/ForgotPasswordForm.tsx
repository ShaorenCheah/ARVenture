'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { resetPassword } from './resetPassword';
import resetPasswordSchema, { ResetPasswordInputs } from './resetPasswordValidation';

interface ForgotPasswordFormProps {
  onSwitch: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitch }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInputs>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInputs) => {
    try {
      setLoading(true);
      await resetPassword(data.email);
      toast.success('Reset email sent. Please check your inbox.');
    } catch {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          minHeight: { xs: 250, sm: 300 },
        }}
      >
        <Stack spacing={1} sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            Reset Password
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Enter your email to receive a password reset link.
          </Typography>
        </Stack>
        <TextField
          fullWidth
          label="Email Address"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 2, py: 1.5, borderRadius: 10 }}
        >
          {loading ? 'Sending...' : 'Send Reset Email'}
        </Button>

        <Typography sx={{ textAlign: 'center', mt: 2, color: '#888888' }}>
          Remember your password?{' '}
          <Button
            variant="text"
            onClick={onSwitch}
            sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
          >
            Back to Login
          </Button>
        </Typography>
      </Stack>
    </form>
  );
};

export default ForgotPasswordForm;
