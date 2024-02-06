'use client';

import { useNotifiRouter } from '@/hooks/useNotifiRouter';

export default function NotifiSignup({
  children,
}: {
  children: React.ReactNode;
}) {
  const routeAvailable = useNotifiRouter();
  if (!routeAvailable) {
    console.log('Notifi route not available');
    return null;
  }
  return <div>{children}</div>;
}
