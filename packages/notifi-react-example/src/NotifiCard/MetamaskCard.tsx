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
  console.log(address);
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
              cardId="d0fd50cfb6e64f49ac28c53a1c4bf5a7"
              darkMode //optional
              inputs={{ userWallet: address }}
            />
          </div>
        </div>
      )}
    </>
  );
};
