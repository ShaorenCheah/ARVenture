'use client';

import { Box, Typography, Divider } from '@mui/material';

export default function EventPanel() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
        Upcoming Events
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography>No events yet. Stay tuned!</Typography>
    </Box>
  );
}
