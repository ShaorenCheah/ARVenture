'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Image from 'next/image';

export default function Header() {
  return (
    <Box component="header">
      <Box sx={{ my: 2 }}>
        <Box
          position="static"
          sx={{
            borderRadius: '50px',
            minHeight: '40px',
            backgroundColor: 'white',
          }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Image src="/icons/ARVentureLogo.png" alt="Logo" width={100} height={30}></Image>
        </Box>
      </Box>
    </Box>
  );
}
