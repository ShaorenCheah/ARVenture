import './globals.css';
import ClientOnly from './components/ClientOnly';
import AppProviders from './components/providers/AppProviders';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientOnly>
          <AppProviders>{children}</AppProviders>
        </ClientOnly>
      </body>
    </html>
  );
}
