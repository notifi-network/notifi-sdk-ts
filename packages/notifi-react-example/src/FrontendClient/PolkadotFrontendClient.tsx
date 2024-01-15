import {
  AcalaSignMessageFunction,
  NotifiEnvironment,
  UserState,
  newFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { FC, useMemo, useState } from 'react';

import {
  AcalaConnectButton,
  useAcalaWallet,
} from '../walletProviders/AcalaWalletContextProvider';

export const PolkadotFrontendClient: FC = () => {
  const tenantId = process.env.REACT_APP_TENANT_ID!;
  const env = process.env.REACT_APP_ENV! as NotifiEnvironment;
  const { acalaAddress, connected, requestSignature, polkadotPublicKey } =
    useAcalaWallet();

  const signMessage: AcalaSignMessageFunction = async (
    _: string,
    message: string,
  ) => {
    if (!connected) {
      throw new Error('Wallet not connected');
    }
    const signature = await requestSignature(acalaAddress!, message);
    return signature;
  };

  const client = useMemo(() => {
    if (acalaAddress && polkadotPublicKey) {
      return newFrontendClient({
        account: {
          address: acalaAddress,
          publicKey: polkadotPublicKey,
        },
        tenantId,
        env,
        walletBlockchain: 'ACALA',
      });
    }
  }, [acalaAddress, polkadotPublicKey]);
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
    if (!client) {
      throw new Error('Client not initialized');
    }
    await client.logIn({
      walletBlockchain: 'ACALA',
      signMessage,
    });

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
    if (!client) {
      throw new Error('Client not initialized');
    }
    if (userState && userState.status === 'authenticated') {
      const data = await client.fetchData();
      setClientData(data);
    }
  };

  return (
    <>
      {connected ? (
        <div>
          <h1>Frontend Client Example: DOT (Acala)</h1>
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
        <AcalaConnectButton />
      )}
    </>
  );
};
