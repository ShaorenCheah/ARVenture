'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import loginSchema from './loginValidation';
import { loginWithEmail } from './loginService';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

interface LoginFormInputs {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSwitch: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitch }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    await loginWithEmail(data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          Login
        </Typography>
        <TextField
          {...register('email')}
          label="Email Address"
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          label="Password"
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
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
          variant="contained"
          type="submit"
          fullWidth
          sx={{ mt: 1, py: 1.5, borderRadius: 10 }}
        >
          Sign In
        </Button>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Don't have an account?{' '}
          <Button variant="text" onClick={onSwitch} sx={{ fontWeight: 'bold', p: 0 }}>
            Join Us
          </Button>
        </Typography>
      </Stack>
    </form>
  );
};

export default LoginForm;
