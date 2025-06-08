'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../theme';
import { Toaster } from 'react-hot-toast';

export default function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </ThemeProvider>
  );
}
