import { Box } from '@mui/material';
import Providers from './components/themeRegistry';
import Footer from './components/footer';
import Header from './components/header';
import UserModal from './components/general/user/userModal';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* Background image container */}
          <Box
            minHeight="100vh"
            height="100%"
            sx={{
              backgroundImage: 'url(/background.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'scroll',
              px: { xs: 2.5, sm: 3, md: 4, lg: 20, xl: 25 },
              pt: { xs: 2.5, sm: 3, md: 4 },
              pb: { xs: '56px', lg: '80px' },
            }}
          >
            <Header />
            {/* Main content area */}
            {children}
            <Footer />
          </Box>
        </Providers>
      </body>
    </html>
  );
}
