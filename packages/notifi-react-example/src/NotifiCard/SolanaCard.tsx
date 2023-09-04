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

import './NotifiCard.css';

export const SolanaCard: React.FC = () => {
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
          <h3>Notification history</h3>
          <button
            onClick={() =>
              client
                .getUnreadNotificationHistoryCount()
                .then((res) => alert(JSON.stringify(res)))
            }
          >
            1. fetch unread notification history count
          </button>

          <button
            onClick={() =>
              client.getFusionNotificationHistory({ first: 10 }).then((res) => {
                alert(
                  JSON.stringify(res).slice(0, 100) +
                    '...\nCHECK CONSOLE FOR FULL RESPONSE',
                );
                console.log(res);
              })
            }
          >
            2. fetch first 10 notification histories
          </button>
          <button
            onClick={async () => {
              const newestHistory = (
                await client?.getFusionNotificationHistory({ first: 1 })
              )?.nodes?.[0];
              if (!newestHistory) {
                return;
              }

              client
                ?.markFusionNotificationHistoryAsRead({
                  ids: [],
                  beforeId: newestHistory.id,
                })
                .then(() => alert('marked all notification history as read'))
                .catch((err) => alert(err));
            }}
          >
            3. mark all notification history as read
          </button>
        </div>
      ) : (
        <div>Not yet register Notification</div>
      )}
      <h3>Display NotifiSubscriptionCard</h3>
      <NotifiSubscriptionCard
        darkMode
        inputLabels={inputLabels}
        inputSeparators={inputSeparators}
        cardId="7f8cf1f9c1074c07a67b63e3bcdf7c3c"
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
      <h2>NotifiIntercomCard</h2>
      <NotifiIntercomCard
        darkMode
        inputLabels={inputLabels}
        inputSeparators={intercomInputSeparators}
        cardId="1045f61752b148eabab0403c08cd60b2"
      />
    </div>
  );
};
