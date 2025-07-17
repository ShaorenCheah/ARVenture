export const metadata = {
  title: 'Sunway ARVenture',
  description: 'Explore Bandar Sunway through AR!',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
