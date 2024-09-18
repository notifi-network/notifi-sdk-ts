import { GoogleOauth2ContextProvider } from '@/context/GoogleOauth2Context';
import { NotifiContextWrapper } from '@/context/NotifiContextWrapper';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Notifi PWA Example',
  description: 'Powered by Notifi.network and next.js app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleOauth2ContextProvider>
          <NotifiContextWrapper>{children}</NotifiContextWrapper>
        </GoogleOauth2ContextProvider>
      </body>
    </html>
  );
}
