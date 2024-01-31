import type { Metadata } from 'next';
import localFont from 'next/font/local';

import './globals.css';

const rota = localFont({
  variable: '--font-rota',
  src: [
    {
      path: '../assets/font/rota/Rota-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/font/rota/Rota-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../assets/font/rota/Rota-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/font/rota/Rota-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../assets/font/rota/Rota-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/font/rota/Rota-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../assets/font/rota/Rota-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../assets/font/rota/Rota-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
    {
      path: '../assets/font/rota/Rota-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../assets/font/rota/Rota-ExtraBoldItalic.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../assets/font/rota/Rota-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/font/rota/Rota-SemiBoldItalic.otf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../assets/font/rota/Rota-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/font/rota/Rota-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../assets/font/rota/Rota-ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../assets/font/rota/Rota-ExtraLightItalic.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../assets/font/rota/Rota-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../assets/font/rota/Rota-ThinItalic.otf',
      weight: '100',
      style: 'italic',
    },
  ],
});

export const metadata: Metadata = {
  title: 'Notifi Dapp Example',
  description: 'Notifi Dapp Example',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rota.variable} font-rota`}>{children}</body>
    </html>
  );
}