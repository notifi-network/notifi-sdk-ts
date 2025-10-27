import { Abstraxion } from '@burnt-labs/abstraxion';
import React, { PropsWithChildren, createContext } from 'react';

import { useWalletManager } from '../hooks/useWalletManager';
import { Wallets } from '../types';
import { NotifiWagmiProvider, NotifiWagmiProviderProps } from './WagmiProvider';
import { XionProvider } from './XionProvider';

type WalletContextType = {
  selectedWallet: keyof Wallets | null;
  selectWallet: (wallet: keyof Wallets) => void;
  wallets: Wallets;
  error: Error | null;
  isLoading: boolean;
};

const WalletContext = createContext<WalletContextType>({
  selectedWallet: null,
  selectWallet: () => {
    console.warn('Not implemented');
  },
  wallets: {} as Wallets,
  error: null,
  isLoading: false,
});

export type WalletOptions = {
  keplr?: KeplrOptions;
  evm?: EvmOptions;
};

export type EvmOptions = {
  cosmosChainPrefix?: string;
};

export type KeplrOptions = {
  chainId: string;
};

export type NotifiWalletProps = PropsWithChildren & {
  walletOptions?: WalletOptions;
};

const NotifiWallet: React.FC<NotifiWalletProps> = ({
  children,
  walletOptions,
}) => {
  const walletManager = useWalletManager(walletOptions);

  return (
    <WalletContext.Provider
      value={{
        selectedWallet: walletManager.selectedWallet,
        selectWallet: walletManager.selectWallet,
        wallets: walletManager.wallets,
        error: walletManager.error,
        isLoading: walletManager.isLoading,
      }}
    >
      <Abstraxion
        onClose={() => {
          walletManager.setShowModal(false);
        }}
      />
      {children}
    </WalletContext.Provider>
  );
};

export type NotifiWalletProviderProps = PropsWithChildren &
  NotifiWalletProps &
  NotifiWagmiProviderProps;

export const NotifiWalletProvider: React.FC<NotifiWalletProviderProps> = ({
  children,
  wagmiConfig,
  walletOptions,
}) => {
  return (
    <NotifiWagmiProvider wagmiConfig={wagmiConfig}>
      <XionProvider>
        <NotifiWallet walletOptions={walletOptions}>{children}</NotifiWallet>
      </XionProvider>
    </NotifiWagmiProvider>
  );
};

export const useWallets = () => React.useContext(WalletContext);
export default NotifiWalletProvider;
