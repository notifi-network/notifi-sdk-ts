import { Icon } from '@/assets/Icon';
import { convertWalletName } from '@/utils/stringUtils';
import { objectKeys } from '@/utils/typeUtils';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import Image from 'next/image';
import { Dispatch, FC, SetStateAction } from 'react';

type WalletSelectModalProps = {
  setIsOpenWalletsModal: Dispatch<SetStateAction<boolean>>;
};

export const WalletSelectModal: FC<WalletSelectModalProps> = ({
  setIsOpenWalletsModal,
}) => {
  const { wallets } = useWallets();
  const availableWallets = objectKeys(wallets);
  let walletsRequiredForGMX: typeof availableWallets = [
    'metamask',
    'coinbase',
    'rabby',
    'walletconnect',
    'binance',
    'okx',
    'rainbow',
    'zerion',
  ];

  walletsRequiredForGMX = walletsRequiredForGMX.sort((a, b) => {
    if (wallets[a].isInstalled && !wallets[b].isInstalled) return -1;
    if (!wallets[a].isInstalled && wallets[b].isInstalled) return 1;
    return 0;
  });

  const isAnySupportedWalletAvailable = walletsRequiredForGMX
    .map((wallet) => wallets[wallet].isInstalled)
    .includes(true);

  return (
    <>
      {/* hide this modal when on mobile view and there is no metamask and keplr extension detected */}
      <div
        className={`fixed inset-0 z-50 bg-black opacity-70 ${
          isAnySupportedWalletAvailable ? '' : 'hidden'
        } sm:block`}
        onClick={() => setIsOpenWalletsModal(false)}
      ></div>
      <div
        className={`flex flex-col fixed z-50 w-90 md:min-w-[681px] my-5 md:my-0 h-[452px] overflow-y-scroll md:overflow-y-hidden border border-notifi-card-border bg-notifi-destination-card-bg rounded-xl ${
          isAnySupportedWalletAvailable ? '' : 'hidden'
        } sm:flex`}
      >
        <div className="relative flex justify-center items-end mt-12">
          <div className="font-medium text-xl text-notifi-text">
            Select your wallet
          </div>
          <Icon
            id="close-icon"
            className="absolute right-8 text-gray-500 cursor-pointer"
            onClick={() => setIsOpenWalletsModal(false)}
          />
        </div>

        <div className="flex gap-6 px-5 md:px-12 pb-5 md:pb-0 pt-10 justify-center items-center flex-wrap">
          {walletsRequiredForGMX.map((walletName) => {
            const { connect, websiteURL, isInstalled } = wallets[walletName];
            return (
              <div
                key={walletName}
                className="relative size-[126px] flex items-center justify-between gap-0.5 flex-col rounded-lg border border-notifi-card-border bg-notifi-destination-card-bg cursor-pointer py-3 px-4 text-notifi-text"
                onClick={async () => {
                  if (!isInstalled) return;

                  await connect?.();
                  setIsOpenWalletsModal(false);
                  /** No need to handle loading and error case, use `const {isLoading, error} = useWallets()  */
                }}
              >
                <Image
                  src={`/logos/${walletName}.svg`}
                  width={58}
                  height={58}
                  unoptimized={true}
                  alt={walletName}
                />
                <div className="text-center">
                  {convertWalletName(walletName)}
                </div>

                {!isInstalled ? (
                  <div
                    onClick={() => {
                      window.open(websiteURL, '_blank');
                    }}
                    className="rounded-lg absolute h-full w-full top-0 right-0"
                  >
                    <div className="rounded-lg h-full w-full flex bg-black opacity-0 cursor-pointer justify-center items-center text-center font-semibold hover:opacity-90">
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
