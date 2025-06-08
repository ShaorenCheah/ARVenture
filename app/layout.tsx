import { Box } from '@mui/material';
import ThemeProviders from './components/ThemeRegistry';
import Footer from './components/footer';
import Header from './components/header';
import { AuthProvider } from './auth/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProviders>
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
          </ThemeProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
