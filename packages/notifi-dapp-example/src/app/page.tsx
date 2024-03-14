'use client';

import { DummyAlertsModal } from '@/components/DummyAlertsModal';
import { EcosystemHero } from '@/components/EcosystemHero';
import { PoweredByNotifi } from '@/components/PoweredByNotifi';
import { WalletSelectModal } from '@/components/WalletSelectModal';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import '@interchain-ui/react/styles';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const { isLoadingRouter, handleRoute } = useRouterAsync();
  const { popGlobalInfoModal } = useGlobalStateContext();
  const { selectedWallet, wallets, error, isLoading } = useWallets();
  const [isOpenWalletsModal, setIsOpenWalletsModal] = useState(false);

  useEffect(() => {
    if (selectedWallet && wallets[selectedWallet].walletKeys) {
      handleRoute('/notifi');
    }
  }, [selectedWallet]);

  useEffect(() => {
    if (error) {
      popGlobalInfoModal({
        message: error.message,
        iconOrEmoji: { type: 'icon', id: 'warning' },
        timeout: 5000,
      });
    }
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col justify-start items-center md:items-center md:justify-center">
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
        isLoading={isLoading || isLoadingRouter}
        cta={() => setIsOpenWalletsModal(true)}
        ctaButtonText="Connect Wallet To Start"
      />
      <DummyAlertsModal />
      <div className="p-2 bg-white rounded-lg h-7 block md:hidden w-[110px] mt-12">
        <PoweredByNotifi />
      </div>
      {isOpenWalletsModal ? (
        <WalletSelectModal setIsOpenWalletsModal={setIsOpenWalletsModal} />
      ) : null}
    </main>
  );
}
