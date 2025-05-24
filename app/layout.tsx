import { Box } from '@mui/material';
import Providers from './components/themeRegistry';
import Footer from './components/footer';
import Header from './components/header';

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
            overflow="hidden"
            sx={{
              backgroundImage: 'url(/background.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              pb: '76px', // room for fixed footer
              px: '16px', // horizontal padding
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
