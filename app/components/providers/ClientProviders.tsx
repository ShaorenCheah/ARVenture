'use client';

import ToasterClient from './ToasterClient';
import { UserModalProvider } from './UserModalContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <UserModalProvider>
      <ToasterClient />
      {children}
    </UserModalProvider>
  );
}
