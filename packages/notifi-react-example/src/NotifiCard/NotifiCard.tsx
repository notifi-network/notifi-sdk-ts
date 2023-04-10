import '@notifi-network/notifi-react-card/dist/index.css';
import React from 'react';

import { AcalaWalletContextProvider } from '../AcalaWalletContextProvider';
import { EthosWalletProvider } from '../EthosWalletProvider';
import { SolanaWalletProvider } from '../SolanaWalletProvider';
import { WalletConnectProvider } from '../WalletConnectProvider';
import { DemoPrviewCard } from './DemoPreviewCard';
import './NotifiCard.css';
import { PolkadotCard } from './PolkadotCard';
import { SolanaCard } from './SolanaCard';
import { SuiNotifiCard } from './SuiNotifiCard';
import { WalletConnectCard } from './WalletConnectCard';

enum ESupportedViews {
  DemoPreview = 'demoPreview',
  Solana = 'solana',
  WalletConnect = 'walletConnect',
  Polkadot = 'pokadot',
  Sui = 'sui',
}

export const NotifiCard: React.FC = () => {
  const [view, setView] = React.useState<JSX.Element>(<DemoPrviewCard />);

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value as ESupportedViews;
    switch (selected) {
      case ESupportedViews.DemoPreview:
        setView(<DemoPrviewCard />);
        break;
      case ESupportedViews.Solana:
        setView(<SolanaCard />);
        return;
      case ESupportedViews.WalletConnect:
        setView(<WalletConnectCard />);
        break;
      case ESupportedViews.Polkadot:
        setView(<PolkadotCard />);
        break;
      case ESupportedViews.Sui:
        setView(<SuiNotifiCard />);
        break;
      default:
        throw new Error('Unsupported view');
    }
  };
  return (
    <div className="container">
      <select onChange={handleViewChange}>
        <option value={ESupportedViews.DemoPreview}>Dummy Demo Preview</option>
        <option value={ESupportedViews.Solana}>Solana</option>
        <option value={ESupportedViews.WalletConnect}>WalletConnect</option>
        <option value={ESupportedViews.Polkadot}>Polkadot</option>
        <option value={ESupportedViews.Sui}>Sui</option>
      </select>
      <WalletConnectProvider>
        <SolanaWalletProvider>
          <EthosWalletProvider>
            <AcalaWalletContextProvider>{view}</AcalaWalletContextProvider>
          </EthosWalletProvider>
        </SolanaWalletProvider>
      </WalletConnectProvider>
    </div>
  );
};
