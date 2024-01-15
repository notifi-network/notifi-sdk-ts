import {
  NotifiSubscriptionCard,
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import React, { useMemo, useState } from 'react';

import { useKeplrContext } from '../walletProviders/KeplrWalletProvider';
import { BellButton } from './BellButton';
import './NotifiCard.css';

export const KeplrConnectButton: React.FC = () => {
  const { key, connect } = useKeplrContext();
  return (
    <button onClick={connect}>
      {key !== undefined ? key.bech32Address : 'Connect'}
    </button>
  );
};

export const KeplrCard: React.FC = () => {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const { alerts } = useNotifiSubscriptionContext();
  const { client, isUsingFrontendClient } = useNotifiClientContext();
  const { key } = useKeplrContext();
  const keyBase64 = useMemo(
    () =>
      key !== undefined
        ? Buffer.from(key.pubKey).toString('base64')
        : undefined,
    [key],
  );

  const injectiveSubscriptionCardId =
    process.env.REACT_APP_INJECTIVE_SUBSCRIPTION_CARD_ID!;

  return (
    <div className="container">
      <h1>Notifi Card: Injective (Keplr)</h1>
      <h3>Subscribing Alert(s)</h3>
      {client.isInitialized && client.isAuthenticated ? (
        <div>
          <ul>
            {Object.keys(alerts).length > 0 &&
              Object.keys(alerts).map((alert) => (
                <li key={alerts[alert]?.id}>
                  <div>{alerts[alert]?.name}</div>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <div>Not yet register Notification</div>
      )}
      <h3>Display NotifiSubscriptionCard</h3>
      {isUsingFrontendClient ? (
        <BellButton setIsCardOpen={setIsCardOpen} />
      ) : null}
      {isCardOpen || !isUsingFrontendClient ? (
        <NotifiSubscriptionCard
          darkMode
          inputs={{ userWallet: key?.bech32Address }}
          cardId={injectiveSubscriptionCardId}
          onClose={() => setIsCardOpen(false)}
        />
      ) : null}
    </div>
  );
};
