'use client';

import ClientProviders from './ClientProviders';
import { SplashProvider } from './SplashContext';
import ThemeProviders from './ThemeRegistry';

import MainLayout from '@/app/components/user/layout/MainLayout';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProviders>
      <SplashProvider>
        <ClientProviders>
          <MainLayout>{children}</MainLayout>
        </ClientProviders>
      </SplashProvider>
    </ThemeProviders>
  );
}
