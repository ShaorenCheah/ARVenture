import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';

import SearchDrawer from './SearchDrawer';

export default function Header() {
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <>
      <Box
        onClick={() => setOpenSearch(true)}
        sx={{
          borderRadius: '50px',
          minHeight: { xs: '40px', lg: '40px' },
          backgroundColor: 'white',
          boxShadow: 2,
          pl: 2,
          pr: 1.5,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2" sx={{ flexGrow: 1, color: 'text.secondary' }}>
          Search for nearby tourist spots...
        </Typography>
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: '50%',
            boxShadow: 3,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconButton sx={{ p: 0.5 }}>
            <SearchIcon sx={{ fontSize: '16px' }} />
          </IconButton>
        </Box>
      </Box>

      <SearchDrawer open={openSearch} onClose={() => setOpenSearch(false)} />
    </>
  );
}
