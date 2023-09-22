import '@notifi-network/notifi-react-card/dist/index.css';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  KeplrNotifiContextWrapper,
  MetamaskNotifiContextWrapper,
  PolkadotNotifiContextWrapper,
  SolanaNotifiContextWrapper,
  SuiNotifiContextWrapper,
  WalletConnectNotifiContextWrapper,
} from '../NotifiContextWrapper';
import { useEvmWallet } from '../walletProviders/EvmWalletProvider';
import { DemoPrviewCard } from './DemoPreviewCard';
import { KeplrCard } from './KeplrCard';
import { MetamaskCard } from './MetamaskCard';
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
  Metamask = 'Metamask',
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
  [ESupportedViews.Metamask]: (
    <MetamaskNotifiContextWrapper>
      <MetamaskCard />
    </MetamaskNotifiContextWrapper>
  ),
};

export const NotifiCard: React.FC = () => {
  const [view, setView] = React.useState<React.ReactNode>(<DemoPrviewCard />);
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

      {/* {selectedViews === ESupportedViews.Solana && (
        <SolanaNotifiContextWrapper>
          <BellButton setIsCardOpen={setIsCardOpen} />
          {isCardOpen && <SolanaCard setIsCardOpen={setIsCardOpen} />}
        </SolanaNotifiContextWrapper>
      )} */}
    </div>
  );
};
