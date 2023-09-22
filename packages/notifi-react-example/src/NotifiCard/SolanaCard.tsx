import {
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiSubscriptionCard,
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { type } from 'os';
import React from 'react';

import { BellButton } from './BellButton';
import './NotifiCard.css';

export const SolanaCard: React.FC = () => {
  const [isCardOpen, setIsCardOpen] = React.useState(false);
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
              client
                .getFusionNotificationHistory({
                  first: 10,
                  includeHidden: false,
                })
                .then((res) => {
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
                await client?.getFusionNotificationHistory({
                  first: 1,
                  includeHidden: false,
                })
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
          <button
            onClick={async () => {
              const newestHistory = (
                await client?.getFusionNotificationHistory({
                  first: 1,
                  includeHidden: false,
                })
              )?.nodes?.[0];
              if (!newestHistory) {
                return;
              }

              client
                ?.markFusionNotificationHistoryAsRead({
                  ids: [newestHistory.id],
                })
                .then(() =>
                  alert('marked the newest notification history as read'),
                )
                .catch((err) => alert(err));
            }}
          >
            4. mark newest notification history as read
          </button>
          <button
            onClick={async () => {
              const newestHistory = (
                await client?.getFusionNotificationHistory({
                  first: 1,
                  includeHidden: false,
                })
              )?.nodes?.[0];
              if (!newestHistory) {
                return alert('no notification in the tray');
              }

              client
                ?.markFusionNotificationHistoryAsRead({
                  ids: [newestHistory.id],
                  readState: 'HIDDEN',
                  /**
                   * @description - If intend to hide all notification at the same time, use below instead
                   * ids: [],
                   * beforeId: newestHistory.id,
                   * readState: 'HIDDEN',
                   */
                })
                .then(async () => {
                  const updatedNewest = (
                    await client?.getFusionNotificationHistory({
                      first: 1,
                      includeHidden: false,
                    })
                  )?.nodes?.[0];
                  alert(
                    `notification history (ID:${newestHistory.id}) created at ${newestHistory.createdDate} is hidden, 
                    now the newest unhidden notification history (ID: ${updatedNewest?.id}) is created at ${updatedNewest?.createdDate}}`,
                  );
                  console.log(updatedNewest);
                })
                .catch((err) => alert(err));
            }}
          >
            5. Hide newest notification
          </button>
        </div>
      ) : (
        <div>Not yet register Notification</div>
      )}
      <h3>Display NotifiSubscriptionCard</h3>

      <BellButton setIsCardOpen={setIsCardOpen} />
      {isCardOpen ? (
        <NotifiSubscriptionCard
          darkMode
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
          cardId="51fd3e3da1104f15abe4e1f8df46747e"
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
      {/* <NotifiIntercomCard
        darkMode
        inputLabels={inputLabels}
        inputSeparators={intercomInputSeparators}
        cardId="1045f61752b148eabab0403c08cd60b2"
      /> */}
    </div>
  );
};
