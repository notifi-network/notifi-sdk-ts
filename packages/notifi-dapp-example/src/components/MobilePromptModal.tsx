import { Icon } from '@/assets/Icon';
import { useInjectiveWallets } from '@/context/InjectiveWalletContext';
import { objectKeys } from '@notifi-network/notifi-react-card';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export type MobilePromptModalProps = Readonly<{
  setIsOpenMobilePromptModal: (isOpenMobilePromptModal: boolean) => void;
}>;

export const MobilePromptModal: React.FC<MobilePromptModalProps> = ({
  setIsOpenMobilePromptModal,
}: MobilePromptModalProps) => {
  const [isClient, setIsClient] = useState(false);
  const { wallets } = useWallets();
  const { wallets: injectiveWallets } = useInjectiveWallets();

  const allWallets = {
    ...wallets,
    ...injectiveWallets,
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCopy = (copy: string) => {
    const input = document.createElement('textarea');
    document.body.appendChild(input);
    input.value = copy;
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  };

  const handleClick = (wallet: string) => {
    switch (wallet) {
      case 'ethereum':
        return openMetamask;
      case 'keplr':
        return openKeplr;
      case 'leap':
        return openLeap;
      case 'phantom':
        return openPhantom;
    }
  };

  const openMetamask = () => {
    window.location.href = 'https://metamask.app.link';
  };

  const openKeplr = () => {
    window.location.href =
      'https://apps.apple.com/ru/app/keplr-wallet/id1567851089';
  };

  const openLeap = () => {
    window.location.href =
      'https://leapcosmoswallet.page.link/HH4EAdKu6wMUYvLH9';
  };

  const openPhantom = () => {
    window.location.href = 'https://phantom.app/ul/v1/connect';
  };

  return (
    <>
      {isClient ? (
        // only show this modal in mobile view
        <div className="fixed inset-0 top-[4rem] flex z-50 sm:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-20 z-50"> </div>
          <div className="h-full w-full md:w-4/6 bg-notifi-container-bg z-50 rounded-2xl flex flex-col items-center justify-between mb-8 shadow-container relative px-4">
            <div className="w-full">
              <div
                className="cursor-pointer absolute top-8 right-8"
                onClick={() => setIsOpenMobilePromptModal(false)}
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

                {objectKeys(allWallets).map((wallet) => {
                  return (
                    <div key={wallet}>
                      {window[wallet] ||
                      !Object.values(allWallets)
                        .map((wallet) => wallet.isInstalled)
                        .includes(true) ? (
                        <div
                          onClick={handleClick(wallet)}
                          className="border rounded-2xl h-24 w-80 mt-6 text-md font-medium flex items-center justify-start pl-4 cursor-pointer"
                        >
                          <Image
                            src={`/logos/${wallet}.svg`}
                            width={72}
                            height={72}
                            alt="metamask"
                            className="mr-3"
                            unoptimized={true}
                          />
                          {wallet}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
