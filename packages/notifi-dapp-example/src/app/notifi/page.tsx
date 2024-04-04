'use client';

import { useNotifiRouter } from '@/hooks/useNotifiRouter';

export default function NotifiHome() {
  useNotifiRouter();
  // Intentionally left blank (/notifi/) is just a redirect page
  return null;
}
