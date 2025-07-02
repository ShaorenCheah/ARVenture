'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { loginWithEmail } from './loginService';
import loginSchema, { LoginFormInputs } from './loginValidation';

interface LoginFormProps {
  onSwitch: () => void;
  onForgot: () => void;
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitch, onForgot, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoading(true);
      await loginWithEmail(data.email, data.password);
      onSuccess(); // Close modal
      toast.success('Logged in successfully!');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast.error(message);
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
        <Stack mb={1.5} spacing={2} sx={{ alignItems: 'start', justifyContent: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Login Account
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.75, color: '#888888' }}>
            Hello, you must log in first to collect collectibles and redeem gifts in Sunway
            ARventure
          </Typography>
        </Stack>

        {/* Text Field */}
        <Stack sx={{ gap: 1, alignItems: 'end', justifyContent: 'center' }}>
          {/* Email Field */}
          <TextField
            {...register('email')}
            label="Email Address"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
          />

          {/* Password Field */}
          <TextField
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            label="Password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="text"
            color="primary"
            onClick={onForgot}
            sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
          >
            Forgot Password?
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={loading}
            sx={{ mt: 1.5, py: 1.5, borderRadius: 10 }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          <Box sx={{ width: '100%' }}>
            <Typography sx={{ textAlign: 'start', mt: 2, color: '#888888' }}>
              Don&apos;t have an account?{' '}
              <Button
                variant="text"
                onClick={onSwitch}
                color="primary"
                sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
              >
                Join Us
              </Button>
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </form>
  );
};

export default LoginForm;
