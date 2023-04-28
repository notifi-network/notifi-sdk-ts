import React from 'react';

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
}

const supportedViews: Record<ESupportedViews, React.ReactNode> = {
  [ESupportedViews.Solana]: <SolanaFrontendClient />,
  [ESupportedViews.WalletConnect]: <WalletConnectFrontendClient />,
  [ESupportedViews.Sui]: <SuiFrontendClient />,
  [ESupportedViews.Polkadot]: <PolkadotFrontendClient />,
  [ESupportedViews.Keplr]: <KeplrFrontendClient />,
};

const FrontendClient: React.FC = () => {
  const [view, setView] = React.useState<React.ReactNode>(
    <SolanaFrontendClient />,
  );

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value as ESupportedViews;
    const v = supportedViews[selected];
    if (v === undefined) {
      throw new Error('Unsupported type');
    }

    setView(v);
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
