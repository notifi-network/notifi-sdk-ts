import '@notifi-network/notifi-react-card/dist/index.css';
import React from 'react';

import {
  KeplrNotifiContextWrapper,
  PolkadotNotifiContextWrapper,
  SolanaNotifiContextWrapper,
  SuiNotifiContextWrapper,
  WalletConnectNotifiContextWrapper,
} from '../NotifiContextWrapper';
import { DemoPrviewCard } from './DemoPreviewCard';
import { KeplrCard } from './KeplrCard';
import './NotifiCard.css';
import { PolkadotCard } from './PolkadotCard';
import { SolanaCard } from './SolanaCard';
import { SuiNotifiCard } from './SuiNotifiCard';
import { WalletConnectCard } from './WalletConnectCard';

enum ESupportedViews {
  DemoPreview = 'Dummy Demo Preview',
  Solana = 'Solana',
  WalletConnect = 'WalletConnect',
  Polkadot = 'Polkadot',
  Sui = 'Sui',
  Keplr = 'keplr',
}

const supportedViews: Record<ESupportedViews, React.ReactNode> = {
  [ESupportedViews.DemoPreview]: <DemoPrviewCard />,
  [ESupportedViews.Solana]: (
    <SolanaNotifiContextWrapper>
      <SolanaCard />
    </SolanaNotifiContextWrapper>
  ),
  [ESupportedViews.WalletConnect]: (
    <WalletConnectNotifiContextWrapper>
      <WalletConnectCard />
    </WalletConnectNotifiContextWrapper>
  ),
  [ESupportedViews.Polkadot]: (
    <PolkadotNotifiContextWrapper>
      <PolkadotCard />
    </PolkadotNotifiContextWrapper>
  ),
  [ESupportedViews.Sui]: (
    <SuiNotifiContextWrapper>
      <SuiNotifiCard />
    </SuiNotifiContextWrapper>
  ),
  [ESupportedViews.Keplr]: (
    <KeplrNotifiContextWrapper>
      <KeplrCard />
    </KeplrNotifiContextWrapper>
  ),
};

export const NotifiCard: React.FC = () => {
  const [view, setView] = React.useState<React.ReactNode>(<DemoPrviewCard />);

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
