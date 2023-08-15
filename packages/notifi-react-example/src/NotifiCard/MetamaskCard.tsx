import {
  NotifiSubscriptionCard,
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { useAccount } from 'wagmi';

export const MetamaskCard = () => {
  const { alerts } = useNotifiSubscriptionContext();
  const { client } = useNotifiClientContext();
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
          <div style={{ width: '400px' }}>
            <NotifiSubscriptionCard
              cardId="d8859ea72ff4449fa8f7f293ebd333c9"
              darkMode //optional
              inputs={{ userWallet: address }}
            />
          </div>
        </div>
      )}
    </>
  );
};
