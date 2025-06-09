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
          px: 2,
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
        <IconButton onClick={() => setOpenSearch(true)}>
          <SearchIcon />
        </IconButton>
      </Box>

      <SearchDrawer open={openSearch} onClose={() => setOpenSearch(false)} />
    </>
  );
}
