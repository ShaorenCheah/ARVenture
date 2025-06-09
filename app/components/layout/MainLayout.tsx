'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import Header from './header';
import SearchBar from '../index/search/SearchBar';
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
  const pathname = usePathname();
  const isLanding = pathname === '/';

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
      {showHeader && (isLanding ? <SearchBar /> : <Header />)}

      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      {showFooter && <Footer />}
    </Box>
  );
}
