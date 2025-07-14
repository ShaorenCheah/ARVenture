'use client';

import { RoleContext } from '@components/providers/RoleContext';
import { Typography, Box, Paper } from '@mui/material';
import { useContext } from 'react';

export default function AdminDashboard() {
  const role = useContext(RoleContext);

  const welcomeText =
    role === 'admin'
      ? 'Welcome, Admin! You have full access to manage users, vouchers, and content.'
      : role === 'merchant'
        ? 'Welcome, Merchant! You can manage your store and vouchers here.'
        : 'Welcome!';

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ mb: 3, color: 'text.secondary' }}>
        {welcomeText}
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Quick Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Use the sidebar to navigate and manage your platform. Features available depend on your
          role.
        </Typography>
      </Paper>
    </Box>
  );
}
