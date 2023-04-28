import { Uint8SignMessageFunction } from '@notifi-network/notifi-core';
import {
  UserState,
  newFrontendClient,
  newFrontendConfig,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { SignInButton, ethos } from 'ethos-connect';
import { FC, useMemo, useState } from 'react';

export const SuiFrontendClient: FC = () => {
  const { status, wallet } = ethos.useWallet();
  const connected = status === 'connected';

  const signMessage: Uint8SignMessageFunction = async (message: Uint8Array) => {
    if (!wallet) {
      throw new Error('Wallet not connected');
    }

    const signature = await wallet.signMessage({
      message,
    });

    const signatureBuffer = Buffer.from(signature.signature);
    return signatureBuffer;
  };

  const client = useMemo(() => {
    if (wallet && wallet.currentAccount) {
      const config = newFrontendConfig({
        account: {
          address: wallet?.currentAccount.address,
          publicKey: wallet?.currentAccount.address,
        },
        tenantId: 'junitest.xyz',
        env: 'Development',
        walletBlockchain: 'SUI',
      });
      return newFrontendClient(config);
    }
  }, [wallet?.currentAccount?.address]);
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
    if (!client || !wallet?.signMessage || !wallet?.currentAccount) {
      throw new Error('Client or wallet not initialized');
    }
    await client.logIn({
      walletBlockchain: 'SUI',
      signMessage: signMessage,
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
          <h1>Frontend Client Example: SUI</h1>
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
        <SignInButton />
      )}
    </>
  );
};
