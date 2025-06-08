'use client';

import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { registerValidationSchema } from './registerValidation';
import { registerWithEmail } from './registerService';

interface RegisterFormProps {
  onSwitch: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitch }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerValidationSchema.validate(formData, { abortEarly: false });
      setLoading(true);
      await registerWithEmail(formData.email, formData.password);
    } catch (validationError: any) {
      const formattedErrors: Record<string, string> = {};
      validationError.inner?.forEach((err: any) => {
        if (err.path) formattedErrors[err.path] = err.message;
      });
      setErrors(formattedErrors);
    } finally {
      setLoading(false);
    }

    await registerWithEmail(formData.email, formData.password);
    setSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          Create Account
        </Typography>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ borderRadius: 10, py: 1.5 }}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
        {success && (
          <Typography variant="body2" color="success.main" textAlign="center">
            Registration successful! Please check your email to verify your account.
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Already have an account?{' '}
          <Button variant="text" onClick={onSwitch} sx={{ fontWeight: 'bold', p: 0 }}>
            Login
          </Button>
        </Typography>
      </Stack>
    </form>
  );
};

export default RegisterForm;
