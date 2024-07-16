import { NotifiWalletContextWrapper } from '@/context/NotifiWalletContextWrapper';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Notifi react example',
  description: 'Notifi react example',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotifiWalletContextWrapper>{children}</NotifiWalletContextWrapper>
      </body>
    </html>
  );
}
