'use client';

import { DummyAlertsModal } from '@/components/DummyAlertsModal';
import { EcosystemHero } from '@/components/EcosystemHero';
import { MobilePromptModal } from '@/components/MobilePromptModal';
import { PoweredByNotifi } from '@/components/PoweredByNotifi';
import { WalletSelectModal } from '@/components/WalletSelectModal';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { NotifiContextWrapper } from '@/context/NotifiContextWrapper';
import { useNotifiRouter } from '@/hooks/useNotifiRouter';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Rendering this Component will trigger the login function
function LoginComponent() {
  useNotifiRouter();
  return null;
}

export default function Home() {
  const { isLoadingRouter } = useRouterAsync();
  const { popGlobalInfoModal } = useGlobalStateContext();
  const { selectedWallet, wallets, error, isLoading } = useWallets();
  const [isOpenWalletsModal, setIsOpenWalletsModal] = useState(false);
  const [isOpenMobilePromptModal, setIsOpenMobilePromptModal] = useState(false);
  const [isSigningMessage, setIsSigningMessage] = useState(false);

  useEffect(() => {
    if (selectedWallet && wallets[selectedWallet].walletKeys)
      setIsSigningMessage(true);
    else setIsSigningMessage(false);
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
      <div className="md:fixed md:top-8 md:left-8 md:right-8 m-3 md:m-0 flex justify-between items-center">
        <div className="left-8 flex items-center">
          <Image
            src="/logos/gmx-logo.png"
            width={115}
            height={24}
            unoptimized={true}
            alt="Injective"
          />
        </div>
        <div className="p-2 rounded-lg h-7 hidden md:block">
          <PoweredByNotifi />
        </div>
      </div>

      <EcosystemHero
        isLoading={isLoading || isLoadingRouter}
        cta={() => {
          setIsOpenWalletsModal(true);
          setIsOpenMobilePromptModal(true);
        }}
        ctaButtonText="Connect Wallet"
      />
      <DummyAlertsModal />
      <div className="p-2 bg-white rounded-lg h-7 block md:hidden w-[110px] mt-12">
        <PoweredByNotifi />
      </div>
      {isOpenWalletsModal ? (
        <WalletSelectModal setIsOpenWalletsModal={setIsOpenWalletsModal} />
      ) : null}
      {/* show this modal if there is no metamask and keplr extension detected */}
      {isOpenMobilePromptModal &&
      !Object.values(wallets)
        .map((wallet) => wallet.isInstalled)
        .includes(true) ? (
        <MobilePromptModal
          setIsOpenMobilePromptModal={setIsOpenMobilePromptModal}
        />
      ) : null}

      {isSigningMessage ? (
        <NotifiContextWrapper>
          <LoginComponent />
        </NotifiContextWrapper>
      ) : null}
    </main>
  );
}
