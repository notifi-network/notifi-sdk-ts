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
  const walletsSupportForGMX: typeof availableWallets = [
    'binance',
    'metamask',
    'coinbase',
    'okx',
    'rabby',
    'zerion',
    'rainbow',
    'walletconnect',
  ];

  const isAnySupportedWalletAvailable = walletsSupportForGMX
    .map((wallet) => wallets[wallet].isInstalled)
    .includes(true);

  return (
    <>
      {/* hide this modal when on mobile view and there is no metamask and keplr extension detected */}
      <div
        className={`fixed h-screen w-screen bg-black opacity-70 ${
          isAnySupportedWalletAvailable ? '' : 'hidden'
        } sm:block`}
        onClick={() => setIsOpenWalletsModal(false)}
      ></div>
      <div
        className={`flex flex-col fixed w-90 min-h-72 md:min-w-[681px] md:h-[452px] border border-notifi-card-border bg-notifi-destination-card-bg rounded-xl ${
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

        <div className="flex gap-6 px-12 pt-10 justify-center items-center flex-wrap">
          {walletsSupportForGMX
            .filter((wallet) => wallets[wallet].isInstalled)
            .map((wallet) => {
              return (
                <div
                  key={wallet}
                  className="size-[126px] flex items-center justify-between gap-0.5 flex-col rounded-lg border border-notifi-card-border bg-notifi-destination-card-bg cursor-pointer py-3 px-4 text-notifi-text"
                  onClick={() => {
                    wallets[wallet].connect();
                    setIsOpenWalletsModal(false);
                    /** No need to handle loading and error case, use `const {isLoading, error} = useWallets()  */
                  }}
                >
                  <Image
                    src={`/logos/${wallet}.svg`}
                    width={58}
                    height={58}
                    unoptimized={true}
                    alt={wallet}
                  />
                  <div className="text-center">{convertWalletName(wallet)}</div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
