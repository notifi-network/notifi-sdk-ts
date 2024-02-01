'use client';

import { useChain, useWalletClient } from '@cosmos-kit/react';
import '@interchain-ui/react/styles';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const { client } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const { connect, wallet, isWalletConnected } = useChain('injective');
  const router = useRouter();

  useEffect(() => {
    if (wallet && client) {
      setLoading(true);
      client?.getAccount?.('injective-1').then((account) => {
        if (account) {
          return router.push('/notifi');
        }
        setLoading(false);
      });
      return;
    }
  }, [wallet]);

  if (loading || !wallet) {
    // TODO: Need loading design
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        loading
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-lg">Injective Keplr wallet connect</div>
      {!isWalletConnected ? (
        <button
          className="bg-green-100 p-5 rounded"
          onClick={() => {
            if (!connect) return console.log('no connect');
            connect();
          }}
        >
          connect
        </button>
      ) : null}
    </main>
  );
}
