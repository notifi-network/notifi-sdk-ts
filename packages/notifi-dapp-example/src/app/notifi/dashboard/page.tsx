'use client';

import { useChain } from '@cosmos-kit/react';
import { useNotifiClientContext } from '@notifi-network/notifi-react-card';

export default function NotifiDashboard() {
  const { disconnect, isWalletConnected } = useChain('injective');
  const {
    frontendClientStatus: { isAuthenticated },
  } = useNotifiClientContext();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      Dummy Dashboard {JSON.stringify({ isAuthenticated })}
      {isWalletConnected ? (
        // NOTE: This hidden button is just FYI in case disconnect is needed during development
        <button
          className="bg-red-100 p-5 rounded hidden"
          onClick={() => {
            if (!disconnect) return console.log('no disconnect');
            disconnect();
          }}
        >
          disconnect wallet
        </button>
      ) : null}
    </div>
  );
}
