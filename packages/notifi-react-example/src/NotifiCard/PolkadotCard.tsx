import {
  NotifiSubscriptionCard,
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { useState } from 'react';

import {
  AcalaConnectButton,
  useAcalaWallet,
} from '../walletProviders/AcalaWalletContextProvider';
import { BellButton } from './BellButton';

export const PolkadotCard = () => {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const { alerts } = useNotifiSubscriptionContext();
  const { client, isUsingFrontendClient } = useNotifiClientContext();
  const { acalaAddress, connected } = useAcalaWallet();

  if (!connected || !acalaAddress) {
    return (
      <div>
        <AcalaConnectButton />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Notifi Card: Polkadot</h1>
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
          cardId="d8859ea72ff4449fa8f7f293ebd333c9"
          onClose={() => setIsCardOpen(false)}
        />
      ) : null}
    </div>
  );
};
