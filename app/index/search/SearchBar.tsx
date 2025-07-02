import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchDrawer from './SearchDrawer';

export default function Header() {
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <>
      <Box
        sx={{
          borderRadius: '50px',
          minHeight: { xs: '40px', lg: '48px', xl: '56px' },
          backgroundColor: 'white',
          boxShadow: 2,
          pl: 2,
          pr: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          component="img"
          src="/icons/ARVentureLogo.png"
          alt="ARVenture Logo"
          sx={{
            height: { xs: '24px', lg: '40px', xl: '48px' },
            width: { xs: '100px', lg: '105px', xl: '120px' },
            objectFit: 'contain',
          }}
        />
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
          <IconButton onClick={() => setOpenSearch(true)} sx={{ p: 0.5 }}>
            <SearchIcon sx={{ fontSize: '16px' }} />
          </IconButton>
        </Box>
      </Box>

      <SearchDrawer open={openSearch} onClose={() => setOpenSearch(false)} />
    </>
  );
}
