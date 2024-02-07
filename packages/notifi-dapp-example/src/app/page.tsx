'use client';

import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useChain, useWalletClient } from '@cosmos-kit/react';
import '@interchain-ui/react/styles';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { client } = useWalletClient();
  const { setIsGlobalLoading, isGlobalLoading } = useGlobalStateContext();
  const { connect, wallet, isWalletConnecting } = useChain('injective');
  const router = useRouter();

  useEffect(() => {
    if (wallet && client) {
      setIsGlobalLoading(true);
      client
        ?.getAccount?.('injective-1')
        .then((account) => {
          if (account) {
            return router.push('/notifi');
          }
        })
        .finally(() => setIsGlobalLoading(false));
      return;
    }
  }, [wallet]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="flex justify-between items-center">
          <Image
            src="/logos/injective.png"
            width={250}
            height={115}
            alt="Injective"
          />
          <div className="mx-4 h-14 border-l border-grey-700"></div>
          <div className="flex w-40 justify-between">
            <Image
              src="/logos/notifi.svg"
              width={38}
              height={38}
              alt="Injective"
            />
            <Image
              src="/logos/notifi-text.svg"
              width={105}
              height={38}
              alt="Injective"
            />
          </div>
        </div>

        <div className="text-4xl font-extrabold mb-7 text-notifi-label-connect-wallet-text">
          Injective ecosystem alerts
        </div>
        <button
          className="rounded bg-notifi-button-primary-bg text-notifi-button-primary-text w-72 h-11"
          onClick={() => connect?.()}
        >
          {isWalletConnecting || isGlobalLoading ? (
            <div className="m-auto h-5 w-5 animate-spin rounded-full  border-2 border-white border-b-transparent border-l-transparent"></div>
          ) : (
            <div>Connect Wallet To Start</div>
          )}
        </button>
      </div>
    </main>
  );
}
