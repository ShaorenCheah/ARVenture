'use client';

import { Box } from '@mui/material';
import Header from './header';
import Footer from './footer';

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  backgroundImage?: string;
}

export default function MainLayout({
  children,
  showHeader = true,
  showFooter = true,
  backgroundImage = '/background.png',
}: MainLayoutProps) {
  return (
    <Box
      minHeight="100vh"
      height="100%"
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        px: { xs: 2.5, sm: 3, md: 4, lg: 20, xl: 25 },
        pt: { xs: 2.5, sm: 3, md: 4 },
        pb: { xs: '56px', lg: '80px' },
      }}
    >
      {showHeader && <Header />}
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      {showFooter && <Footer />}
    </Box>
  );
}
