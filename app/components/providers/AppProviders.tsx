'use client';

import { AuthProvider } from '@/app/auth/AuthContext';
import ThemeProviders from './ThemeRegistry';
import ClientProviders from './ClientProviders';
import MainLayout from '@/app/components/layout/MainLayout';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProviders>
        <ClientProviders>
          <MainLayout>{children}</MainLayout>
        </ClientProviders>
      </ThemeProviders>
    </AuthProvider>
  );
}
