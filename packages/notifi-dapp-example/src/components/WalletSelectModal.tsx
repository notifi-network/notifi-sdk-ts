import { Icon } from '@/assets/Icon';
import { objectKeys } from '@notifi-network/notifi-react-card';
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

  return (
    <>
      <div
        className="fixed h-screen w-screen bg-gray-900/50"
        onClick={() => setIsOpenWalletsModal(false)}
      ></div>
      <div className="flex flex-col fixed w-90 h-72 md:w-[40rem] md:h-80 border border-gray-700/50 bg-white rounded-xl">
        <div className=" flex h-14 justify-center items-end">
          <div className="font-medium text-xl">Select your wallet</div>
        </div>
        <Icon
          id="close-icon"
          className="absolute right-8 top-8 text-gray-500 cursor-pointer"
          onClick={() => setIsOpenWalletsModal(false)}
        />
        <div className="flex grow gap-6 px-5 justify-center items-center">
          {objectKeys(wallets)
            .filter((wallet) => wallets[wallet].isInstalled)
            .map((wallet) => {
              return (
                <div
                  key={wallet}
                  className="bg-white size-32 flex items-center justify-center flex-col gap-3 rounded-lg border border-gray-600/10 cursor-pointer"
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
                  <div>{wallet}</div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};