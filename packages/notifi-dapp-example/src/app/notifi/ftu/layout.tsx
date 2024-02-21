'use client';

import { useNotifiRouter } from '@/hooks/useNotifiRouter';

export default function NotifiFTU({ children }: { children: React.ReactNode }) {
  useNotifiRouter();

  return <div>{children}</div>;
}
