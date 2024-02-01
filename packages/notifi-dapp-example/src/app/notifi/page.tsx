'use client';

import { useNotifiClientStatus } from '@/hooks/useNotifiClientStatus';
import { useChain } from '@cosmos-kit/react';

export default function NotifiHome() {
  const { disconnect, isWalletConnected } = useChain('injective');

  const { isExpired, isAuthenticated, isInitialized } = useNotifiClientStatus();

  if (!isInitialized) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-notifi-page-bg">
      {JSON.stringify({ isExpired, isAuthenticated, isInitialized })}
      {isWalletConnected ? (
        // NOTE: This hidden button is just FYI in case disconnect is needed during development
        <button
          className="bg-red-100 p-5 rounded hidden"
          onClick={() => {
            if (!disconnect) return console.log('no disconnect');
            disconnect();
          }}
        >
          disconnect
        </button>
      ) : null}
    </main>
  );
}
