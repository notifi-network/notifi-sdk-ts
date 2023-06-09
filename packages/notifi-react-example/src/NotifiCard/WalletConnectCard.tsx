import {
  NotifiSubscriptionCard,
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';

export const WalletConnectCard = () => {
  const { alerts } = useNotifiSubscriptionContext();
  const { client } = useNotifiClientContext();
  return (
    <div>
      <h1>Notifi Card: WalletConnect</h1>
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
          cardId="7fa9505a96064ed6b91ba2d14a9732de"
          darkMode //optional
        />
      </div>
    </div>
  );
};
