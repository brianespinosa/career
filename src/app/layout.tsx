import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Career Ladder',
    default: 'Career Ladder',
  },
  metadataBase: new URL('https://career.bje.co/'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
