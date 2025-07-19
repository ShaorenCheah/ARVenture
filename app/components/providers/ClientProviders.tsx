'use client';

import { AuthProvider } from '@auth/AuthContext';
import SplashScreen from '@components/user/SplashScreen';
import { Box, CircularProgress } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useSplash } from './SplashContext';
import ToasterClient from './ToasterClient';
import { UserModalProvider } from './UserModalContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const pathname = usePathname();
  const hasMountedOnce = useRef(false);
  const { showSplash } = useSplash();
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    if (!showSplash) {
      if (hasMountedOnce.current) {
        setRouteLoading(true);
        const routeTimer = setTimeout(() => setRouteLoading(false), 500);
        return () => clearTimeout(routeTimer);
      } else {
        hasMountedOnce.current = true;
      }
    }
  }, [pathname, showSplash]);

  return (
    <AuthProvider>
      <UserModalProvider>
        <ToasterClient />

        {showSplash && <SplashScreen duration={5000} />}

        {!showSplash && routeLoading && (
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: 1300,
              backgroundColor: 'rgba(255,255,255,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <CircularProgress sx={{ color: '#ED1D24' }} />
          </Box>
        )}

        {children}
      </UserModalProvider>
    </AuthProvider>
  );
}
