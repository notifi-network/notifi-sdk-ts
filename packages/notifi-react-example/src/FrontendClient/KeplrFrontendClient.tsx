import {
  Uint8SignMessageFunction,
  UserState,
  newInjectiveClient,
  newInjectiveConfig,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { FC, useMemo, useState } from 'react';

import { useKeplrContext } from '../walletProviders/KeplrWalletProvider';

export const KeplrFrontendClient: FC = () => {
  const { key, signArbitrary, connect } = useKeplrContext();
  const keyBase64 = useMemo(
    () =>
      key !== undefined
        ? Buffer.from(key.pubKey).toString('base64')
        : undefined,
    [key],
  );

  const signMessage: Uint8SignMessageFunction = async (message) => {
    if (!key) {
      throw new Error('Key not initialized');
    }
    const result = await signArbitrary(
      'injective-1',
      key.bech32Address,
      message,
    );
    return Buffer.from(result.signature, 'base64');
  };

  const client = useMemo(() => {
    if (key && keyBase64) {
      const config = newInjectiveConfig(
        {
          address: key.bech32Address,
          publicKey: keyBase64,
        },
        'junitest.xyz',
        'Development',
      );
      return newInjectiveClient(config);
    }
  }, [key, keyBase64]);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [clientData, setClientData] = useState<Types.FetchDataQuery>();

  const initClient = async () => {
    if (!client) {
      throw new Error('Client not initialized');
    }
    const newUserState = await client.initialize();
    newUserState && setUserState(newUserState);
  };

  const login = async () => {
    if (!client) {
      throw new Error('Client not initialized');
    }
    try {
      await client?.logIn({
        walletBlockchain: 'INJECTIVE',
        signMessage,
      });
    } catch (e) {
      console.log(e);
    }
    setUserState(client.userState);
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
      throw new Error('Client not initialized or not logged in');
    }
    const data = await client.fetchData();
    setClientData(data);
  };

  return (
    <>
      {key && keyBase64 ? (
        <div>
          <h1>Frontend Client Example: Injective (Keplr)</h1>
          {!!!userState && (
            <button onClick={initClient}>initialize FrontendClient</button>
          )}
          {userState?.status === 'loggedOut' ||
          userState?.status === 'expired' ? (
            <button onClick={login}>login</button>
          ) : null}
          {!!userState && userState.status === 'authenticated' ? (
            <>
              <button onClick={fetchData}>fetch client data</button>
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
        <button onClick={connect}>
          {key !== undefined ? key.bech32Address : 'Connect'}
        </button>
      )}
    </>
  );
};
