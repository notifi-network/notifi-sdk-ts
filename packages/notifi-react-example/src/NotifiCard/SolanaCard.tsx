import {
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiIntercomCard,
  NotifiSubscriptionCard,
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import React from 'react';

import { BellButton } from './BellButton';
import './NotifiCard.css';

export const SolanaCard: React.FC = () => {
  const [isCardOpen, setIsCardOpen] = React.useState(false);
  const { alerts } = useNotifiSubscriptionContext();
  const { client, isUsingFrontendClient } = useNotifiClientContext();

  const solanaSubscriptionCardId =
    process.env.REACT_APP_SOLANA_SUBSCRIPTION_CARD_ID;
  const solanaIntercomCardId = process.env.REACT_APP_SOLANA_INTERCOM_CARD_ID;

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

  const intercomInputSeparators: NotifiInputSeparators = {
    emailSeparator: {
      content: '',
    },
  };

  return (
    <div className="container">
      <h1>Notifi Card: Solana</h1>
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
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
          cardId={solanaSubscriptionCardId}
          onClose={() => setIsCardOpen(false)}
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
      <h2>NotifiIntercomCard</h2>
      <NotifiIntercomCard
        darkMode
        inputLabels={inputLabels}
        inputSeparators={intercomInputSeparators}
        cardId={solanaIntercomCardId}
      />
    </div>
  );
};
