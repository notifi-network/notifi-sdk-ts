'use client';

import { useNotifiClientContext } from '@notifi-network/notifi-react-card';

export default function NotifiExpiry() {
  const {
    frontendClientStatus: { isExpired },
  } = useNotifiClientContext();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      Dummy Expiry page {JSON.stringify({ isExpired })}
    </div>
  );
}
