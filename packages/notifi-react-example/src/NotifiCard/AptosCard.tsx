import { useWallet } from '@aptos-labs/wallet-adapter-react';
import {
  NotifiSubscriptionCard,
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { useState } from 'react';

import { BellButton } from './BellButton';

export const AptosCard = () => {
  const { account } = useWallet();
  const [isCardOpen, setIsCardOpen] = useState(false);
  const { alerts } = useNotifiSubscriptionContext();
  const { client, isUsingFrontendClient } = useNotifiClientContext();
  return (
    <>
      {account?.address && (
        <div>
          <h1>Notifi Card: APTOS</h1>
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
              inputs={{ userWallet: account.address }}
              cardId="d8859ea72ff4449fa8f7f293ebd333c9"
              onClose={() => setIsCardOpen(false)}
            />
          ) : null}
        </div>
      )}
    </>
  );
};
