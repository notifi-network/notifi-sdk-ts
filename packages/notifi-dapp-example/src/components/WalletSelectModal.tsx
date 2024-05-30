import { Icon } from '@/assets/Icon';
import { useInjectiveWallets } from '@/context/InjectiveWalletContext';
import { convertWalletName } from '@/utils/stringUtils';
import { objectKeys } from '@/utils/typeUtils';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import Image from 'next/image';
import { Dispatch, FC, SetStateAction } from 'react';

const walletsWebsiteLink = {
  metamask: 'https://metamask.io/download/',
  keplr: 'https://www.keplr.app/download',
  leap: 'https://www.leapwallet.io/download',
  phantom: 'https://phantom.app/download',
};

type WalletSelectModalProps = {
  setIsOpenWalletsModal: Dispatch<SetStateAction<boolean>>;
};

export const WalletSelectModal: FC<WalletSelectModalProps> = ({
  setIsOpenWalletsModal,
}) => {
  const { wallets } = useWallets();
  const { wallets: injectiveWallets } = useInjectiveWallets();

  const allWallets = {
    ...wallets,
    ...injectiveWallets,
  };

  const availableWallets = objectKeys(allWallets);
  let walletsRequiredForODF: typeof availableWallets = [
    'keplr',
    'metamask',
    'leap',
    'phantom',
  ];

  walletsRequiredForODF = walletsRequiredForODF.sort((a, b) => {
    if (allWallets[a].isInstalled && !allWallets[b].isInstalled) return -1;
    if (!allWallets[a].isInstalled && allWallets[b].isInstalled) return 1;
    return 0;
  });

  return (
    <>
      {/* hide this modal when on mobile view and there is no metamask and keplr extension detected */}
      <div
        className={`fixed h-screen w-screen bg-gray-900/50 ${
          Object.values(allWallets)
            .map((wallet) => wallet.isInstalled)
            .includes(true)
            ? ''
            : 'hidden'
        } sm:block`}
        onClick={() => setIsOpenWalletsModal(false)}
      ></div>
      <div
        className={`flex flex-col fixed w-90 min-h-72 md:min-w-[40rem] md:h-80 border border-gray-700/50 bg-white rounded-xl ${
          Object.values(allWallets)
            .map((wallet) => wallet.isInstalled)
            .includes(true)
            ? ''
            : 'hidden'
        } sm:flex`}
      >
        <div className=" flex h-14 justify-center items-end">
          <div className="font-medium text-xl">Select your wallet</div>
        </div>
        <Icon
          id="close-icon"
          className="absolute right-8 top-8 text-gray-500 cursor-pointer"
          onClick={() => setIsOpenWalletsModal(false)}
        />
        <div className="flex grow gap-6 p-5 justify-center items-center flex-wrap">
          {walletsRequiredForODF.map((wallet) => {
            const { connect, isInstalled } = allWallets[wallet];
            const websiteURL = walletsWebsiteLink[wallet];

            return (
              <div
                key={wallet}
                className="relative bg-white size-32 flex items-center justify-center flex-col gap-3 rounded-lg border border-gray-600/10 cursor-pointer"
                onClick={() => {
                  if (!isInstalled) return;

                  connect?.();
                  setIsOpenWalletsModal(false);
                  /** No need to handle loading and error case, use `const {isLoading, error} = useWallets()  */
                }}
              >
                <Image
                  src={`/logos/${wallet}.svg`}
                  width={77}
                  height={77}
                  unoptimized={true}
                  alt={wallet}
                />
                <div>{convertWalletName(wallet)}</div>

                {!isInstalled ? (
                  <div
                    onClick={() => {
                      window.open(websiteURL, '_blank');
                    }}
                    className="rounded-lg absolute h-full w-full top-0 right-0"
                  >
                    <div className="rounded-lg h-full w-full flex bg-black opacity-0 cursor-pointer justify-center text-white items-center text-center font-semibold hover:opacity-80">
                      Install
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
