import React from 'react';

import { useEvmWallet } from '../walletProviders/EvmWalletProvider';
import { InjectiveMetamaskFrontendClient } from './InjectiveMetamaskFrontendClient';
import { KeplrFrontendClient } from './KeplrFrontendClient';
import { PolkadotFrontendClient } from './PolkadotFrontendClient';
import { SolanaFrontendClient } from './SolanaFrontendClient';
import { SuiFrontendClient } from './SuiFrontendClient';
import { WalletConnectFrontendClient } from './WalletConnectFrontendClient';

enum ESupportedViews {
  Solana = 'Solana',
  WalletConnect = 'WalletConnect',
  Sui = 'Sui',
  Polkadot = 'Polkadot',
  Keplr = 'keplr',
  InjectiveMetamask = 'InjectiveMetamask',
}

const supportedViews: Record<ESupportedViews, React.ReactNode> = {
  [ESupportedViews.Solana]: <SolanaFrontendClient />,
  [ESupportedViews.WalletConnect]: <WalletConnectFrontendClient />,
  [ESupportedViews.Sui]: <SuiFrontendClient />,
  [ESupportedViews.Polkadot]: <PolkadotFrontendClient />,
  [ESupportedViews.Keplr]: <KeplrFrontendClient />,
  [ESupportedViews.InjectiveMetamask]: <InjectiveMetamaskFrontendClient />,
};

const FrontendClient: React.FC = () => {
  const [view, setView] = React.useState<React.ReactNode>(
    <SolanaFrontendClient />,
  );
  const { setWalletAdapter } = useEvmWallet();

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value as ESupportedViews;
    const v = supportedViews[selected];
    if (v === undefined) {
      throw new Error('Unsupported type');
    }

    setView(v);
    switch (selected) {
      case ESupportedViews.WalletConnect:
        setWalletAdapter('walletconnect');
        break;
      default:
        setWalletAdapter('metamask');
    }
  };

  return (
    <div className="container">
      <select onChange={handleViewChange}>
        {Object.keys(supportedViews).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      {view}
    </div>
  );
};

export default FrontendClient;
