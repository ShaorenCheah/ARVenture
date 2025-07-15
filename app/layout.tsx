export const metadata = {
  title: 'Sunway ARventure',
  description: 'Explore Bandar Sunway through AR!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
