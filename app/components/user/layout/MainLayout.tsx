'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';

import Footer from './footer';
import Header from './header';
import SearchBar from '../../../(user)/index/search/SearchBar';

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
      sx={{
        minHeight:'100vh',
        ...(isLanding
          ? {
              height: { xs: 'auto', lg: '100vh' },
            }
          : {
              
            }),
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        px: { xs: 2.5, sm: 10, md: 25, xl: 40 },
        pt: { xs: 3, md: 3, xl: 6 },
        pb: { xs: '99px', xl: 14 },
      }}
    >
      {showHeader && (
        <Box marginBottom={isLanding ? 1 : 2.5} sx={{ flexShrink: 0 }}>
          {isLanding ? <SearchBar /> : <Header />}
        </Box>
      )}

      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: isLanding ? 'hidden' : 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>

      {showFooter && (
        <Box sx={{ flexShrink: 0, mt: 'auto' }}>
          <Footer />
        </Box>
      )}
    </Box>
  );
}
