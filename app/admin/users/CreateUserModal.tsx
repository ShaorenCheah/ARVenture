'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import {
  Modal,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  MenuItem,
  Paper,
  IconButton,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import { createUserValidationSchema, CreateUserFormInputs } from './userValidation';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  reloadUsers: () => void;
}

export default function CreateUserModal({ open, onClose, reloadUsers }: CreateUserModalProps) {
  const handleClose = () => {
    reset(); // Clear form fields
    onClose(); // Close modal
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormInputs>({
    resolver: yupResolver(createUserValidationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
    },
  });

  const handleFormSubmit = async (data: CreateUserFormInputs) => {
    try {
      const res = await fetch('/admin/users/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success('User created successfully!');
      reset();
      reloadUsers();
      onClose();
    } catch (error: unknown) {
      let message = 'Failed to create user';
      if (error instanceof Error) message = error.message;
      toast.error(message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      slotProps={{
        backdrop: {
          sx: {
            zIndex: 1300,
          },
        },
      }}
    >
      <Box
        sx={{
          zIndex: 1301,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 500,
            p: 3,
            borderRadius: 2,
            backgroundColor: 'white',
            position: 'relative',
          }}
        >
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 12, right: 12 }}>
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" fontWeight={600} gutterBottom mb={3}>
            Create New User
          </Typography>

          <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <Stack spacing={2} mt={1}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />

              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Role"
                    select
                    fullWidth
                    error={!!errors.role}
                    helperText={errors.role?.message}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="merchant">Merchant</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </TextField>
                )}
              />

              <Stack direction="row" justifyContent="flex-end" spacing={2} pt={2.5}>
                <Button onClick={handleClose} variant="outlined">
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  Create
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Modal>
  );
}
