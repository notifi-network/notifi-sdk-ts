'use client';

import { useNotifiRouter } from '@/hooks/useNotifiRouter';
import { useSearchParams } from 'next/navigation';

export default function NotifiHome() {
  const searchParams = useSearchParams();
  const tempCardId = searchParams.get('cardid');
  useNotifiRouter(tempCardId ? { cardid: tempCardId } : undefined);
  // Intentionally left blank (/notifi/) is just a redirect page
  return null;
}
