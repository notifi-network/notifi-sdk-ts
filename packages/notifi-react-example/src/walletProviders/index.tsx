import { FC, PropsWithChildren } from 'react';

import { AcalaWalletContextProvider } from './AcalaWalletContextProvider';
import { EthosWalletProvider } from './EthosWalletProvider';
import { KeplrWalletProvider } from './KeplrWalletProvider';
import { SolanaWalletProvider } from './SolanaWalletProvider';
import { WalletConnectProvider } from './WalletConnectProvider';

const WalletProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AcalaWalletContextProvider>
      <EthosWalletProvider>
        <KeplrWalletProvider>
          <SolanaWalletProvider>
            <WalletConnectProvider>{children}</WalletConnectProvider>
          </SolanaWalletProvider>
        </KeplrWalletProvider>
      </EthosWalletProvider>
    </AcalaWalletContextProvider>
  );
};

export default WalletProviders;
