'use client';

import ThemeProviders from './ThemeRegistry';
import ToasterClient from './ToasterClient';

import { AuthProvider } from '@/app/auth/AuthContext';

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProviders>
        <ToasterClient />
        {children}
      </ThemeProviders>
    </AuthProvider>
  );
}
