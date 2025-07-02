import Box from '@mui/material/Box';
import * as React from 'react';

export default function Header() {
  return (
    <Box component="header" sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
      <Box>
        <Box
          position="static"
          sx={{
            borderRadius: '50px',
            minHeight: { xs: '40px', lg: '48px', xl: '56px' },
            backgroundColor: 'white',
            boxShadow: 1,
          }}
          display="flex"
          justifyContent="center"
          alignItems="center"
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
        </Box>
      </Box>
    </Box>
  );
}
