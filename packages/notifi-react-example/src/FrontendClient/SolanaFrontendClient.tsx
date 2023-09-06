import {
  UserState,
  newFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC, useMemo, useState } from 'react';

export const SolanaFrontendClient: FC = () => {
  const { wallet, signMessage, connected } = useWallet();
  const adapter = wallet?.adapter;
  const publicKey = adapter?.publicKey?.toBase58() ?? null;

  const client = useMemo(() => {
    if (publicKey) {
      return newFrontendClient({
        account: {
          publicKey,
        },
        tenantId: 'junitest.xyz',
        env: 'Development',
        walletBlockchain: 'SOLANA',
      });
    }
  }, [publicKey]);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [clientData, setClientData] = useState<Types.FetchDataQuery>();

  const initClient = async () => {
    if (!client) {
      throw new Error('Client not initialized');
    }
    const newUserState = await client.initialize();
    setUserState(newUserState);
  };

  const login = async () => {
    if (signMessage && client) {
      await client.logIn({
        walletBlockchain: 'SOLANA',
        signMessage,
      });
      setUserState(client.userState);
    }
  };

  const logOut = async () => {
    if (!client) {
      throw new Error('Client not initialized');
    }
    await client.logOut();
    const newUserState = await client.initialize();
    setUserState(newUserState);
  };

  const fetchData = async () => {
    if (!userState || userState.status !== 'authenticated' || !client) {
      throw new Error('Client not initialized or user not authenticated');
    }
    const data = await client.fetchData();
    setClientData(data);
  };

  return (
    <>
      {connected ? (
        <div>
          <h1>Frontend Client Example: Solana</h1>
          {!!!userState && (
            <button onClick={initClient}>initialize FrontendClient</button>
          )}
          {userState?.status === 'loggedOut' ||
          userState?.status === 'expired' ? (
            <button onClick={login}>login</button>
          ) : null}
          {!!userState && userState.status === 'authenticated' ? (
            <>
              <h3>Data </h3>
              <button onClick={fetchData}>fetch client data</button>
              <h3>Notification history</h3>
              <button
                onClick={() =>
                  client
                    ?.getUnreadNotificationHistoryCount()
                    .then((res) => alert(JSON.stringify(res)))
                }
              >
                1. fetch unread notification history count
              </button>
              <button
                onClick={() =>
                  client
                    ?.getFusionNotificationHistory({ first: 10 })
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
                    .then(() =>
                      alert('marked all notification history as read'),
                    )
                    .catch((err) => alert(err));
                }}
              >
                3. mark all notification history as read
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
              <h3>Auth</h3>
              <button onClick={logOut}>logout</button>
            </>
          ) : null}
          <h2>User State: {userState?.status}</h2>
          {!!clientData && userState?.status === 'authenticated' && (
            <>
              <h2>Client Data: The logged in user has</h2>
              {Object.keys(clientData).map((key, id) => {
                return (
                  <div key={id}>
                    {clientData[key as keyof Types.FetchDataQuery]?.length}{' '}
                    {key}
                  </div>
                );
              })}
            </>
          )}
        </div>
      ) : (
        <WalletMultiButton />
      )}
    </>
  );
};
