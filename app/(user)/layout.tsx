import '../globals.css';
import AppProviders from '../components/providers/AppProviders';
import ClientOnly from '../components/providers/ClientOnly';

export const metadata = {
  title: 'Sunway ARventure | Explore',
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly>
      <AppProviders>{children}</AppProviders>
    </ClientOnly>
  );
}
