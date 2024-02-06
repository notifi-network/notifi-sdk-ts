'use client';

import { useNotifiRouter } from '@/hooks/useNotifiRouter';
import { useNotifiClientContext } from '@notifi-network/notifi-react-card';

export default function NotifiHome() {
  const { frontendClientStatus } = useNotifiClientContext();

  const routeAvailable = useNotifiRouter();
  if (!routeAvailable) {
    console.log('Notifi route not available');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {JSON.stringify({
        isExpired: frontendClientStatus.isExpired,
        isAuthenticated: frontendClientStatus.isInitialized,
        isInitialized: frontendClientStatus.isInitialized,
      })}
    </div>
  );
}
