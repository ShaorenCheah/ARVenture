'use client';

import ClientProviders from './ClientProviders';
import { SplashProvider } from './SplashContext';
import ThemeProviders from './ThemeRegistry';

import { AuthProvider } from '@/app/auth/AuthContext';
import MainLayout from '@/app/components/user/layout/MainLayout';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProviders>
        <SplashProvider>
          <ClientProviders>
            <MainLayout>{children}</MainLayout>
          </ClientProviders>
        </SplashProvider>
      </ThemeProviders>
    </AuthProvider>
  );
}
