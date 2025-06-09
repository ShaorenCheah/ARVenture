'use client';

import ToasterClient from './ToasterClient';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <>
      <ToasterClient />
      {children}
    </>
  );
}
