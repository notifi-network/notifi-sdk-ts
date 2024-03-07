'use client';

import { DummyAlertsModal } from '@/components/DummyAlertsModal';
import { EcosystemHero } from '@/components/EcosystemHero';
import { PoweredByNotifi } from '@/components/PoweredByNotifi';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import { useChain, useWalletClient } from '@cosmos-kit/react';
import '@interchain-ui/react/styles';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Home() {
  const { connect, isWalletConnecting } = useChain('injective');
  const { isLoadingRouter, handleRoute } = useRouterAsync();
  const { client } = useWalletClient();

  useEffect(() => {
    if (client) {
      client?.getAccount?.('injective-1').then((account) => {
        if (account) {
          handleRoute('/notifi');
        }
      });
    }
  }, [client]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="fixed top-8 left-8 right-8 flex justify-between">
        <div className="left-8 flex items-center">
          <Image
            src="/logos/injective.png"
            width={115}
            height={24}
            alt="Injective"
          />
          <div className="mx-4 h-4 border-l-2 border-grey-700"></div>
          <div className="text-gray-400 text-xs tracking-wider">
            INJECTIVE ECOSYSTEM ALERTS
          </div>
        </div>
        <div className=" p-2 bg-white rounded-lg h-7">
          <PoweredByNotifi />
        </div>
      </div>
      <EcosystemHero
        isLoading={isWalletConnecting || isLoadingRouter}
        cta={connect}
        ctaButtonText="Connect Wallet To Start"
      />
      <DummyAlertsModal />
    </main>
  );
}
