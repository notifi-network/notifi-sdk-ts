'use client';

import { DummyAlertsModal } from '@/components/DummyAlertsModal';
import { EcosystemHero } from '@/components/EcosystemHero';
import { PoweredByNotifi } from '@/components/PoweredByNotifi';
// import { useWallets } from '@/context/wallet/NotifiWalletProvider';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import { useChain, useWalletClient } from '@cosmos-kit/react';
import '@interchain-ui/react/styles';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Home() {
  const { connect, isWalletConnecting } = useChain('injective');
  const { isLoadingRouter, handleRoute } = useRouterAsync();
  const { client } = useWalletClient();
  const { selectWallet, selectedWallet, wallets } = useWallets();

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
    <main className="flex min-h-screen flex-col justify-start items-center md:items-center md:justify-center">
      <div>{selectedWallet && JSON.stringify(wallets[selectedWallet])}</div>
      <div
        onClick={() =>
          selectWallet(selectedWallet === 'keplr' ? 'metamask' : 'keplr')
        }
      >
        selected wallet: {selectedWallet}, switch
      </div>
      <div
        onClick={() => {
          if (!selectedWallet) return;
          wallets[selectedWallet].connect();
        }}
      >
        connect
      </div>
      <div className="md:fixed md:top-8 md:left-8 md:right-8 m-3 md:m-0 flex justify-between">
        <div className="left-8 flex items-center">
          <Image
            src="/logos/injective.png"
            width={115}
            height={24}
            unoptimized={true}
            alt="Injective"
          />
          <div className="mx-4 h-4 border-l-2 border-grey-700"></div>
          <div className="text-gray-400 text-xs tracking-wider w-full">
            INJECTIVE NOTIFICATIONS
          </div>
        </div>
        <div className="p-2 bg-white rounded-lg h-7 hidden md:block">
          <PoweredByNotifi />
        </div>
      </div>
      <EcosystemHero
        isLoading={isWalletConnecting || isLoadingRouter}
        cta={connect}
        ctaButtonText="Connect Wallet To Start"
      />
      <DummyAlertsModal />
      <div className="p-2 bg-white rounded-lg h-7 block md:hidden w-[110px] mt-12">
        <PoweredByNotifi />
      </div>
    </main>
  );
}
