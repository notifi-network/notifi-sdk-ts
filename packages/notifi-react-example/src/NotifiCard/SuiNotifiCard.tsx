import { useNotifiSubscriptionContext } from '@notifi-network/notifi-react-card';
import { useNotifiClientContext } from '@notifi-network/notifi-react-card';
import {
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import { ethos } from 'ethos-connect';
import React from 'react';

export const SuiNotifiCard: React.FC = () => {
  const { wallet } = ethos.useWallet();
  const { alerts } = useNotifiSubscriptionContext();
  const { client } = useNotifiClientContext();

  const inputLabels: NotifiInputFieldsText = {
    label: {
      email: 'Email',
      sms: 'Text Message',
      telegram: 'Telegram',
    },
    placeholderText: {
      email: 'Email',
    },
  };

  const inputSeparators: NotifiInputSeparators = {
    smsSeparator: {
      content: '',
    },
    emailSeparator: {
      content: '',
    },
  };

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
      {wallet ? (
        <NotifiSubscriptionCard
          darkMode
          inputs={{ userWallet: wallet.address }}
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
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
      ) : null}
    </div>
  );
};
