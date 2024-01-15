import {
  NotifiSubscriptionCard,
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import React, { useState } from 'react';

import { BellButton } from './BellButton';

export const SuiNotifiCard: React.FC = () => {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const { alerts } = useNotifiSubscriptionContext();
  const { client, isUsingFrontendClient } = useNotifiClientContext();

  const suiSubscriptionCardId = process.env.REACT_APP_SUI_SUBSCRIPTION_CARD_ID!;

  return (
    <div className="container">
      <h1>Notifi Card: Sui</h1>
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
          cardId={suiSubscriptionCardId}
          onClose={() => setIsCardOpen(false)}
        />
      ) : null}
    </div>
  );
};
