import {
  NotifiSubscriptionCard,
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';

import {
  AcalaConnectButton,
  useAcalaWallet,
} from '../walletProviders/AcalaWalletContextProvider';

export const PolkadotCard = () => {
  const { alerts } = useNotifiSubscriptionContext();
  const { client } = useNotifiClientContext();
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
      <NotifiSubscriptionCard
        darkMode
        cardId="d8859ea72ff4449fa8f7f293ebd333c9"
        onClose={() => alert('nope you must stay')}
        copy={{
          FetchedStateCard: {
            SubscriptionCardV1: {
              signUpHeader: 'Please sign up',
              EditCard: {
                AlertListPreview: {
                  description:
                    'Get your alerts here!!! you can subscribe to any of the following:',
                },
              },
            },
          },
        }}
      />
    </div>
  );
};
