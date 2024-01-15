import { Uint8SignMessageFunction } from '@notifi-network/notifi-core';
import {
  NotifiEnvironment,
  UserState,
  newFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { arrayify } from 'ethers/lib/utils.js';
import { FC, useMemo, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';

import { connector } from '../walletProviders/EvmWalletProvider';

export const WalletConnectFrontendClient: FC = () => {
  const tenantId = process.env.REACT_APP_TENANT_ID!;
  const env = process.env.REACT_APP_ENV! as NotifiEnvironment;
  const [userState, setUserState] = useState<UserState | null>(null);
  const [clientData, setClientData] = useState<Types.FetchDataQuery>();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: connector,
  });
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();

  const client = useMemo(() => {
    if (address && isConnected) {
      return newFrontendClient({
        walletBlockchain: 'ETHEREUM',
        account: { publicKey: address },
        tenantId,
        env,
      });
    }
  }, [address, isConnected]);

  const signMessage: Uint8SignMessageFunction = async (message: Uint8Array) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    const signature = await signMessageAsync({
      message,
    });

    const signatureBuffer = arrayify(signature);
    return signatureBuffer;
  };

  const initClient = async () => {
    if (!client) {
      throw new Error('Client not initialized');
    }
    const newUserState = await client.initialize();
    setUserState(newUserState);
  };

  const login = async () => {
    if (!address || !isConnected || !client) {
      throw new Error('Client or wallet not initialized');
    }
    await client.logIn({
      walletBlockchain: 'ETHEREUM',
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
      {isConnected && !!address ? (
        <div>
          <h1>Frontend Client Example: WalletConnect</h1>
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
        <button onClick={() => (isConnected ? disconnect() : connect())}>
          {isConnected ? `Disconnect: ${address}` : 'Connect Wallet'}
        </button>
      )}
    </>
  );
};
