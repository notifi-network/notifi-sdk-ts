import { FC, PropsWithChildren } from 'react';

import { AcalaWalletContextProvider } from './AcalaWalletContextProvider';
import { EthosWalletProvider } from './EthosWalletProvider';
import { EvmWalletProvider } from './EvmWalletProvider';
import { KeplrWalletProvider } from './KeplrWalletProvider';
import { SolanaWalletProvider } from './SolanaWalletProvider';

const WalletProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AcalaWalletContextProvider>
      <EthosWalletProvider>
        <KeplrWalletProvider>
          <SolanaWalletProvider>
            <EvmWalletProvider>{children}</EvmWalletProvider>
          </SolanaWalletProvider>
        </KeplrWalletProvider>
      </EthosWalletProvider>
    </AcalaWalletContextProvider>
  );
};

export default WalletProviders;
