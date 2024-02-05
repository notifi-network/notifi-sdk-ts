'use client';

import { useNotifiRouter } from '@/hooks/useNotifiRouter';

export default function NotifiExpiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useNotifiRouter();

  return <div>{children}</div>;
}
