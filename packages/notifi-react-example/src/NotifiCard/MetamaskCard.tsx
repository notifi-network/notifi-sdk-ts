import {
  NotifiSubscriptionCard,
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import { BellButton } from './BellButton';

export const MetamaskCard = () => {
  const evmSubscriptionCardId = process.env.REACT_APP_EVM_SUBSCRIPTION_CARD_ID;
  const [isCardOpen, setIsCardOpen] = useState(false);
  const { alerts } = useNotifiSubscriptionContext();
  const { client, isUsingFrontendClient } = useNotifiClientContext();
  const { address } = useAccount();
  return (
    <>
      {address && (
        <div>
          <h1>Notifi Card: Metamask</h1>
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
          {isUsingFrontendClient ? (
            <BellButton setIsCardOpen={setIsCardOpen} />
          ) : null}
          {isCardOpen || !isUsingFrontendClient ? (
            <NotifiSubscriptionCard
              darkMode
              inputs={{ userWallet: address }}
              cardId={evmSubscriptionCardId}
              onClose={() => setIsCardOpen(false)}
            />
          ) : null}
        </div>
      )}
    </>
  );
};
