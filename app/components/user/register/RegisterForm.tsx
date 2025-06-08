'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { RegisterFormInputs, registerValidationSchema } from './registerValidation';
import { registerWithEmail } from './registerService';
import toast from 'react-hot-toast';

interface RegisterFormProps {
  onSwitch: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitch }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(registerValidationSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      setLoading(true);
      await registerWithEmail(data.name, data.email, data.password);
      toast.success('Account created successfully! Please check your email for verification.', {
        duration: 8000,
      });
    } catch (error: any) {
      toast.error(error.message || 'Registration failed', { duration: 6000 });
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
          minHeight: { xs: 350, sm: 420 },
        }}
      >
        {/* Logo */}
        <Box mb={2}>
          <Box
            component="img"
            src="/icons/ARVentureLogo.png"
            sx={{
              width: '100%',
              height: 'auto',
              maxWidth: { xs: '120px', sm: '170px' },
            }}
          />
        </Box>

        {/* Text Content */}
        <Stack mb={2} spacing={2} sx={{ alignItems: 'start', justifyContent: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Register Account
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.75, color: '#888888' }}>
            Create an account to start your AR journey! Collect hidden treasures and unlock
            exclusive rewards around Bandar Sunway
          </Typography>
        </Stack>

        {/* Text Field */}
        <Stack
          sx={{
            gap: 1,
            alignItems: 'end',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <TextField
            {...register('name')}
            fullWidth
            label="Name"
            error={!!formErrors.name}
            helperText={formErrors.name?.message}
            margin="normal"
          />
          <TextField
            {...register('email')}
            fullWidth
            label="Email"
            error={!!formErrors.email}
            helperText={formErrors.email?.message}
            margin="normal"
          />
          <TextField
            {...register('password')}
            fullWidth
            type="password"
            label="Password"
            error={!!formErrors.password}
            helperText={formErrors.password?.message}
            margin="normal"
          />
          <TextField
            {...register('confirmPassword')}
            fullWidth
            type="password"
            label="Confirm Password"
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword?.message}
            margin="normal"
          />
        </Stack>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 1.5, borderRadius: 10, py: 1.5 }}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>

        <Typography sx={{ textAlign: 'start', mt: 2, color: '#888888' }}>
          Already have an account?{' '}
          <Button
            variant="text"
            onClick={onSwitch}
            color="primary"
            sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
          >
            Login
          </Button>
        </Typography>
      </Stack>
    </form>
  );
};

export default RegisterForm;
