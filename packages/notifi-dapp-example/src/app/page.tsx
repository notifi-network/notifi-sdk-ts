'use client';

import { Icon } from '@/assets/Icon';
import { DummyAlertsModal } from '@/components/DummyAlertsModal';
import { EcosystemHero } from '@/components/EcosystemHero';
import { PoweredByNotifi } from '@/components/PoweredByNotifi';
import { WalletSelectModal } from '@/components/WalletSelectModal';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const { isLoadingRouter, handleRoute } = useRouterAsync();
  const { popGlobalInfoModal } = useGlobalStateContext();
  const { selectedWallet, wallets, error, isLoading } = useWallets();
  const [isOpenWalletsModal, setIsOpenWalletsModal] = useState(false);
  const [isOpenMobileReminderModal, setIsOpenMobileReminderModal] =
    useState(true);

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

  const handleCopy = (copy: string) => {
    const input = document.createElement('textarea');
    document.body.appendChild(input);
    input.value = copy;
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  };

  const openMetamask = () => {
    window.location.href = 'https://metamask.app.link';
  };

  // const openKeplr = () => {};

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

      {isOpenMobileReminderModal ? (
        <div className="fixed inset-0 top-[4rem] flex z-50 sm:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-20 z-50"> </div>
          <div className="h-full w-full md:w-4/6 bg-notifi-container-bg z-50 rounded-2xl flex flex-col items-center justify-between mb-8 shadow-container relative px-4">
            <div className="w-full">
              <div
                className="cursor-pointer absolute top-8 right-8"
                onClick={() => setIsOpenMobileReminderModal(false)}
              >
                <Icon id="close-icon" className="text-notifi-text-light" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl mt-14 mx-4 text-center">
                  Sign in on desktop, or access notifications from your wallet’s
                  browser
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="border rounded-2xl h-16 w-80 mt-6 text-notifi-primary-text text-md font-semibold flex items-center justify-center">
                  injective.notifi.network
                  <Icon
                    id="copy-btn"
                    className="text-notifi-primary-text cursor-pointer"
                    onClick={() => handleCopy('injective.notifi.network')}
                  />
                </div>
                <div
                  onClick={openMetamask}
                  className="border rounded-2xl h-24 w-80 mt-6 text-md font-medium flex items-center justify-start pl-4 cursor-pointer"
                >
                  <Image
                    src="/logos/img-metamask.jpg"
                    width={77}
                    height={77}
                    alt="metamask"
                    className="mr-3"
                    unoptimized={true}
                  />
                  Metamask
                </div>
                {/* <div
                  onClick={openKeplr}
                  className="border rounded-2xl h-24 w-80 mt-6 text-md font-medium flex items-center justify-start pl-4"
                >
                  <Image
                    src="/logos/img-keplr.jpg"
                    width={75}
                    height={75}
                    alt="keplr"
                    className="mr-4"
                    unoptimized={true}
                  />
                  Keplr
                </div> */}
              </div>
            </div>
          </div>
        </div>
      ) : null}

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
