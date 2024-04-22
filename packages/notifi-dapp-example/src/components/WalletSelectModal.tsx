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

  const allWallets = {
    ...wallets,
  };

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
        className={`flex flex-col fixed w-90 min-h-72 md:min-w-[40rem] md:h-80 border border-notifi-card-border bg-notifi-destination-card-bg rounded-xl ${
          Object.values(allWallets)
            .map((wallet) => wallet.isInstalled)
            .includes(true)
            ? ''
            : 'hidden'
        } sm:flex`}
      >
        <div className=" flex h-14 justify-center items-end">
          <div className="font-medium text-xl text-notifi-text">
            Select your wallet
          </div>
        </div>
        <Icon
          id="close-icon"
          className="absolute right-8 top-8 text-gray-500 cursor-pointer"
          onClick={() => setIsOpenWalletsModal(false)}
        />
        <div className="flex grow gap-6 p-5 justify-center items-center flex-wrap">
          {objectKeys(wallets)
            .filter(
              (wallet) => wallets[wallet].isInstalled && wallet !== 'keplr',
            )
            .map((wallet) => {
              return (
                <div
                  key={wallet}
                  className="size-32 flex items-center justify-center flex-col gap-3 rounded-lg border border-notifi-card-border bg-notifi-destination-card-bg cursor-pointer pt-2 text-notifi-text"
                  onClick={() => {
                    wallets[wallet].connect();
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
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
