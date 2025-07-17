import Box from '@mui/material/Box';
import * as React from 'react';

export default function Header() {
  return (
    <Box component="header">
      <Box>
        <Box
          position="static"
          sx={{
            borderRadius: '50px',
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
              height: '50px',
              width: { xs: '100px', lg: '105px', xl: '120px' },
              objectFit: 'contain',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
