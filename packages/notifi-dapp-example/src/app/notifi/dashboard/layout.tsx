'use client';

import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiRouter } from '@/hooks/useNotifiRouter';

export default function NotifiDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isInitialized } = useGlobalStateContext();
  if (isInitialized !== 'initialized') {
    return null;
  }
  useNotifiRouter();

  return <div>{children}</div>;
}
