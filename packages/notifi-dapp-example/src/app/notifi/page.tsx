'use client';

import { useNotifiRouter } from '@/hooks/useNotifiRouter';

export default function NotifiHome() {
  useNotifiRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center hidden">
      Dummy empty landing page
    </div>
  );
}
