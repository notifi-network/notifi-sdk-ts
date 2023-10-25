import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { PropsWithChildren } from 'react';

export const AptosWalletProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const wallets = [new PetraWallet()];
  return (
    <AptosWalletAdapterProvider plugins={wallets}>
      {children}
    </AptosWalletAdapterProvider>
  );
};
